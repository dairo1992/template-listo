import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { UsuarioService } from 'src/app/services/usuario.service';
import GenerarComponent from '../generar/generar.component';
import { TurnosService } from 'src/app/services/turnos.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AlmacenService } from 'src/app/services/storage.service';
import { SocketService } from 'src/app/services/socket.service';
import { AlertaSwal } from 'src/app/components/swal-alert';
import ServiciosComponent from "../../servicios/servicios.component";
import { ServiciosService } from 'src/app/services/servicios.service';
import { Servicio } from 'src/app/interfaces/servicio.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-gestionar',
    standalone: true,
    imports: [PrimeModule, GenerarComponent, ServiciosComponent],
    templateUrl: './gestionar.component.html',
    styleUrl: './gestionar.component.scss',
})
export default class GestionarComponent {
    modalGenerarTurno: boolean = false;
    modalListaTurno: boolean = false;
    modalRedirigirTurno: boolean = false;
    public currentUser: Usuario = inject(UsuarioService).currentUser();
    public turnosService = inject(TurnosService);
    public utilitiService = inject(UtilitiesService);
    public storageService = inject(AlmacenService);
    private socketService = inject(SocketService);
    public serviciosService = inject(ServiciosService);
    public getStatus = inject(UtilitiesService).getStatus;
    alert: AlertaSwal;


    constructor(private router: Router) {
        this.alert = new AlertaSwal();
        if (this.currentUser.modulo.id == null) {
            Swal.fire({
                position: "center",
                icon: 'info',
                title: "!NOTIFICACION¡",
                text: "NO TIENE UN MODULO ASIGNADO",
                showConfirmButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.router.navigateByUrl('/home/nuevo-turno');
                }
            });
            return;
        }
        this.turnosService.obtenerTurnosCant(this.currentUser.id);
    }

    consultarTurnos() {
        this.modalListaTurno = true;
        this.turnosService.obtenerTurnos(this.currentUser.id);
    }

    llamarTurno() {
        this.turnosService.llamarTurno(this.currentUser.id).subscribe({
            next: async (turno) => {
                if (turno.STATUS) {
                    const user = this.currentUser;
                    await this.socketService.emit('lista-turnos', { "empresa_id": user.empresa.id, "sede_id": user.empresa.sede.id, "usuario_id": user.id })
                    this.turnosService._currentTurno.set(turno);
                    this.storageService.almacenarDatosTurno(turno);
                    this.socketService.emit('llamado', { "empresa_id": user.empresa.id, sede_id: user.empresa.sede.id, turno_id: turno.DATA.turno_id });
                } else {
                    this.alert.showMessage({
                        position: "center",
                        icon: turno.STATUS ? 'success' : 'error',
                        title: "!NOTIFICACION¡",
                        text: turno.MSG,
                        showConfirmButton: true,
                    });
                }

            },
            error: (err) => {
                this.turnosService._currentTurno.set(null);
            },
        });
    }

    finalizarTurno() {
        this.turnosService.finalizarTurno(this.turnosService.currentTurno().DATA.turno_id, this.currentUser.id).subscribe({
            next: async (turno) => {
                if (turno.STATUS) {
                    this.turnosService._currentTurno.set({ STATUS: false, MSG: '', DATA: null });
                    this.storageService.limpiarItem('turno');
                    this.turnosService.obtenerTurnosCant(this.currentUser.id);
                    await this.socketService.emit('lista-turnos', { "empresa_id": this.currentUser.empresa.id, "sede_id": this.currentUser.empresa.sede.id, "usuario_id": this.currentUser.id })
                }
                this.alert.showMessage({
                    position: "center",
                    icon: turno.STATUS ? 'success' : 'error',
                    title: "!NOTIFICACION¡",
                    text: turno.MSG,
                    showConfirmButton: true,
                });
                // this.messageService.add({
                //     severity: turno.STATUS ? 'success' : 'error',
                //     summary: '!NOTIFICACION¡',
                //     detail: turno.MSG,
                // });
            },
            error: (err) => {
                this.turnosService._currentTurno.set(null);
                this.alert.showMessage({
                    position: "center",
                    icon: 'error',
                    title: "!NOTIFICACION¡",
                    text: err.error,
                    showConfirmButton: true,
                });
            },
        });
    }

    llamarNuevamente(turno: any) {
        console.log(turno);
        this.socketService.emit('llamado', { "empresa_id": this.currentUser.empresa.id, sede_id: this.currentUser.empresa.sede.id, turno_id: turno.turno_id });
    }

    obtenerServicios(): void {
        const id_user = this.currentUser.id;
        this.alert.loading();
        this.serviciosService.obtenerServicios(id_user).subscribe({
            next: (data) => {
                this.serviciosService._lista_servicios.set(data);
                this.alert.close();
                // if (this.modalGenerarTurno === false) {
                this.modalRedirigirTurno = true;
                // }
            },
            error: (err) => {
                this.alert.showMessage({
                    position: "center",
                    icon: "error",
                    title: "!NOTIFICACION¡",
                    text: err.error,
                    showConfirmButton: true,
                });
            },
        });
    }

    transferir(servicio: Servicio) {
        this.alert.loading();
        const turno = {
            turno_id: this.turnosService.currentTurno().DATA.turno_id,
            servicio_inicial: this.turnosService.currentTurno().DATA.servicio_id,
            servicio_fin: servicio.id,
            responsable: this.currentUser.id
        };
        this.turnosService.transferirTurno(turno).subscribe({
            next: (data) => {
                this.modalRedirigirTurno = false;
                this.turnosService._currentTurno.set({ STATUS: false, MSG: '', DATA: null });
                this.turnosService.obtenerTurnosCant(this.currentUser.id)
                this.storageService.limpiarDatosTurno();
                this.turnosService.obtenerTurnos(this.currentUser.id);
                this.alert.showMessage({
                    position: "center",
                    icon: data.STATUS ? "success" : "error",
                    title: "!NOTIFICACION¡",
                    text: data.MSG,
                    showConfirmButton: true,
                });
            },
            error: (err) => {
                this.alert.showMessage({
                    position: "center",
                    icon: "error",
                    title: "!NOTIFICACION¡",
                    text: err.error,
                    showConfirmButton: true,
                });
            },
        });
    }

    async actualizarPantalla() {
        await this.socketService.emit('lista-turnos', { "empresa_id": this.currentUser.empresa.id, "sede_id": this.currentUser.empresa.sede.id, "usuario_id": this.currentUser.id })
    }
}
