import { computed, Injectable, signal } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private echo: Echo<any>;
  private _turnos = signal<any[]>([]);
  public turnos = computed(() => this._turnos());

  constructor() {

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'digiturno', // Aquí deberías colocar tu Pusher App Key (en .env de Laravel)
      cluster: 'mt1', // Aquí colocar el cluster de tu aplicación Pusher
      forceTLS: true
    });
    this.listenToTurnosChannel();
  }

  simulateTurno() {
    this.echo.channel('turnos').whisper('TurnoLlamado', {
      turno: { id: 123, numero: 'A01' }  // Datos de prueba estáticos
    });
  }

  listenToTurnosChannel() {
    return this.echo.channel('turnos') // El canal que escuchará (definido en Laravel)
      .listen('TurnoLlamado', (event: any) => {
        console.log('Nuevo turno llamado:', event.turno);
        this._turnos.set(event.turno);
        // Aquí podrías manejar el evento (guardar en una lista, etc.)
      });
  }

  disconnect() {
    if (this.echo) {
      this.echo.disconnect();
    }
  }
}
