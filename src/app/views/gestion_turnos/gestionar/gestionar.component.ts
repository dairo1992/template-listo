import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { UsuarioService } from 'src/app/services/usuario.service';
import GenerarComponent from '../generar/generar.component';
import { TurnosService } from 'src/app/services/turnos.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AlmacenService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-gestionar',
    standalone: true,
    imports: [PrimeModule, GenerarComponent],
    templateUrl: './gestionar.component.html',
    styleUrl: './gestionar.component.scss',
})
export default class GestionarComponent {
    modalGenerarTurno: boolean = false;
    modalListaTurno: boolean = false;
    public currentUser: Usuario = inject(UsuarioService).currentUser();
    public turnosService = inject(TurnosService);
    public utilitiService = inject(UtilitiesService);
    public storageService = inject(AlmacenService);
    // resumen = {
    //     ACTIVOS: 0,
    //     ATENDIDOS: 0,
    //     TOTAL: 0
    // };
    // servicios_asignados = [];

    constructor() {
        // const resumen = {
        //     ACTIVOS: 0,
        //     ATENDIDOS: 0,
        //     TOTAL: 0
        // };
        // const agrupadoPorServicio = {};
        this.turnosService.obtenerTurnosCant(this.currentUser.id)
        // .subscribe({
        //     next: (value) => {
        //         value.forEach((turno, i) => {
        //             // Actualizar el resumen general
        //             if (turno.estado === "esperando" || turno.estado === "en_atencion") {
        //                 resumen.ACTIVOS += 1;
        //             } else if (turno.estado === "atendido") {
        //                 resumen.ATENDIDOS += 1;
        //             }
        //             resumen.TOTAL += 1;

        //             // Agrupar por servicio
        //             const servicio = turno.nombre_servicio;
        //             if (!agrupadoPorServicio[servicio]) {
        //                 agrupadoPorServicio[servicio] = {
        //                     nombre: servicio,
        //                     total: 0,
        //                     activos: 0,
        //                     atendidos: 0
        //                 };
        //             }

        //             agrupadoPorServicio[servicio].total += 1;

        //             if (turno.estado === "esperando" || turno.estado === "en_atencion") {
        //                 agrupadoPorServicio[servicio].activos += 1;
        //             } else if (turno.estado === "atendido") {
        //                 agrupadoPorServicio[servicio].atendidos += 1;
        //             }
        //         });
        //         this.resumen = resumen;
        //         this.servicios_asignados = Object.values(agrupadoPorServicio);
        //     }
        // })
    }

    consultarTurnos() {
        this.modalListaTurno = true;
        this.turnosService.obtenerTurnos(this.currentUser.id);
    }

    llamarTurno() {
        this.turnosService.llamarTurno(this.currentUser.id);
    }

    finalizarTurno() {
        this.turnosService.finalizarTurno(this.turnosService.currentTurno().DATA.turno_id, this.currentUser.id);
    }

    pausarTurno(){
        
    }
}
