import { formatDate } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { TurnoGenerado } from 'src/app/interfaces/turno-generado.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { PantallaAdminService } from 'src/app/services/pantalla-admin.service';
import { SocketService } from 'src/app/services/socket.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-pantalla',
  standalone: true,
  imports: [PrimeModule],
  templateUrl: './pantalla.component.html',
  styleUrl: './pantalla.component.scss'
})
export default class PantallaComponent implements OnInit, OnDestroy {
  service = inject(PantallaAdminService);
  usuarioService = inject(UsuarioService);
  private socketService = inject(SocketService);
  private subscriptions: Subscription[] = [];
  public turnoLlamado: boolean = false;
  turnoLLamadoInfo: any = null;
  currentDate: string = '';
  currentTime: string = '';
  timeSubscription: Subscription | undefined;

  imagenes: any[] = [];
  turnos: TurnoGenerado[] = [];
  responsiveOptions = [
    {
      breakpoint: '1300px',
      numVisible: 4
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ];
  mensaje: any;

  constructor() {
    const card = document.getElementById('card-turno');
    // escuchar un evento que envia el servidor
    this.socketService.conectarSocket().then(() => {
      this.subscriptions.push(
        this.socketService.listen<TurnoGenerado[]>("lista-turnos").subscribe({
          next: (turnosResponse) => {
            this.turnos = turnosResponse;
            turnosResponse.forEach(async turno => {
              if (turno.estado == 'en_atencion') {
                await this.socketService.emit('llamado', { "empresa_id": turno.modulo.sede.empresa.id, "sede_id": turno.modulo.sede.id, "turno_id": turno.id })
              }
            });
          },
          error: (err) => console.log(err)
        })
      );
      this.subscriptions.push(
        this.socketService.listen<string>("mensaje").subscribe({
          next: (resp) => {
            this.mensaje = resp;
          },
          error: (err) => console.log(err)
        })
      );
      this.subscriptions.push(
        this.socketService.listen<string>("llamado").subscribe({
          next: (resp) => {
            if (card != null) {
              card.classList.replace('bg-primary', 'bg-green-500');
            }
            this.turnoLlamado = true;
            this.turnoLLamadoInfo = resp;
            // document.getElementById('card-turno').classList.add('bg-red-500');
            setTimeout(() => {
              this.turnoLlamado = false;
            }, 8000);
            this.llamadoTurnoByVoz((this.turnoLLamadoInfo.cliente.nombre + ' ' + this.turnoLLamadoInfo.cliente.apellido), this.turnoLLamadoInfo.turno_formateado, this.turnoLLamadoInfo.modulo.nombre);

          },
          error: (err) => console.log(err)
        })
      );
    });

  }

  async ngOnInit(): Promise<void> {
    const currentUser = this.usuarioService._currentUser();
    this.obtenerImagenes(currentUser.empresa.id);
    const bogotaTimeZone = 'America/Bogota';
    this.timeSubscription = interval(1000).subscribe(() => {
      const now = new Date();
      this.currentDate = formatDate(now, 'EEEE d \'de\' MMMM \'de\' yyyy', 'es-CO', bogotaTimeZone);
      this.currentTime = formatDate(now, 'hh:mm:ss a', 'es-CO', bogotaTimeZone).replace('a. m.', 'AM').replace('p. m.', 'PM');
    });
    const voices = speechSynthesis.getVoices();
    console.log(voices);

    try {
      await this.socketService.emit('lista-turnos', { "empresa_id": currentUser.empresa.id, "sede_id": currentUser.empresa.sede.id, "usuario_id": currentUser.id })
      await this.socketService.emit('mensaje', { "empresa_id": currentUser.empresa.id, "sede_id": currentUser.empresa.sede.id, "usuario_id": currentUser.id })
    } catch (error) {
      console.error('Error al emitir lista-turnos:', error);
    }
  }

  ngOnDestroy(): void {
    // Limpiar todas las suscripciones al destruir el componente
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.socketService.disconnect();
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  obtenerImagenes(id_empresa: number) {
    this.imagenes = [];
    this.service.obtenerImagenes(id_empresa).subscribe({
      next: (resp: any[]) => {
        if (resp.length > 0) {
          this.imagenes = resp.map(item => ({
            itemImageSrc: `http://localhost/api-digiturno/uploads/${id_empresa}/${item}`,
            thumbnailImageSrc: `http://localhost/api-digiturno/uploads/${id_empresa}/${item}`,
            alt: item.nombreArchivo,
            title: item.nombreArchivo
          }));
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  llamadoTurnoByVoz(nombre: string, turno: string, modulo: string) {
    let speaking = false;
    if (!('speechSynthesis' in window)) {
      console.error("Tu navegador no soporta la síntesis de voz.");
      return;
    }

    const mensaje = new SpeechSynthesisUtterance(`Turno número ${turno}  , ${nombre}, modulo 3`);
    if (speaking) return;
    mensaje.lang = 'es-ES'; // Idioma español
    mensaje.pitch = 1; // Tono (ajustable entre 0 y 2, donde 1 es natural)
    mensaje.rate = 1.0; // Velocidad ligeramente reducida para mayor naturalidad
    mensaje.volume = 1; // Volumen máximo
    const vocesDisponibles = window.speechSynthesis.getVoices();
    const vozPreferida = vocesDisponibles.find(voz => voz.lang === 'co-CO' && voz.name.includes('Microsoft')); // Buscar una voz natural
    if (vozPreferida) {
      mensaje.voice = vozPreferida;
    } else {
      console.warn("No se encontró una voz más natural, se usará la predeterminada.");
    }    // Reproducir el mensaje
    mensaje.onstart = () => { speaking = true; };
    mensaje.onend = () => { speaking = false; };
    window.speechSynthesis.speak(mensaje);
  }

}
