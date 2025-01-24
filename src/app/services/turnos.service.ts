import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { url } from 'src/environments/environment';
import { TurnosActivos } from '../interfaces/turnos-activos.interface';
import { TurnoLlamado } from '../interfaces/turno-llamado.interface';
import { AlmacenService } from './storage.service';
import { TurnosByUsuario } from '../interfaces/turnos-usuario.interface';

@Injectable({
    providedIn: 'root',
})
export class TurnosService {
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    public _currentTurno = signal<TurnoLlamado>({ STATUS: false, MSG: '', DATA: null });
    public currentTurno = computed(() => this._currentTurno());
    private _lista_turnos = signal<TurnosActivos[]>([]);
    public lista_turnos = computed(() => this._lista_turnos());
    private http = inject(HttpClient);
    private storage = inject(AlmacenService);

    private _resumen = signal<TurnosByUsuario>({ ACTIVOS: 0, ATENDIDOS: 0, TOTAL: 0, TURNOS: [] });
    public resumen = computed(() => this._resumen());

    constructor(private messageService: MessageService) {
        const turno = this.storage.obtenerDatosTurno();
        if (turno != null) {
            this._currentTurno.set(turno);
        }
    }

    generarTurno(turno: any) {
        const fecha_creacion = turno.fecha_creacion;
        const hora_creacion = turno.hora_creacion;
        turno.fecha_creacion = formatDate(
            new Date(fecha_creacion),
            'yyyy-MM-dd',
            'en-US'
        );
        turno.hora_creacion = formatDate(
            new Date(hora_creacion),
            'H:mm:ss',
            'en-US'
        );
        return this.http.post(`${url}/turnos`, turno);
    }

    imprimirTurno(id: number) {
        return this.http.get(`${url}/turnos/${id}`);
    }

    obtenerTurnos(usuario_id: number) {
        return this.http.post<TurnosActivos[]>(`${url}/turnos/activos`, { usuario_id }).subscribe({
            next: (turnos) => {
                this._lista_turnos.set(turnos);
                this._isLoading.set(false);
            },
            error: (err) => {
                this._isLoading.set(false);
                this._lista_turnos.set([]);
                this.messageService.add({
                    severity: 'error',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        });
    }

    obtenerTurnosCant(usuario_id: number) {
        this.http.post<TurnosActivos[]>(`${url}/turnos/activos`, { usuario_id }).subscribe({
            next: (value) => {
                var resumen: TurnosByUsuario = { ACTIVOS: 0, ATENDIDOS: 0, TOTAL: 0, TURNOS: [] };
                const agrupadoPorServicio = {};
                value.forEach((turno, i) => {
                    // Actualizar el resumen general
                    if (turno.estado === "esperando" || turno.estado === "en_atencion") {
                        resumen.ACTIVOS += 1;
                    } else if (turno.estado === "atendido") {
                        resumen.ATENDIDOS += 1;
                    }
                    resumen.TOTAL += 1;

                    // Agrupar por servicio
                    const servicio = turno.nombre_servicio;
                    if (!agrupadoPorServicio[servicio]) {
                        agrupadoPorServicio[servicio] = {
                            nombre: servicio,
                            total: 0,
                            activos: 0,
                            atendidos: 0
                        };
                    }

                    agrupadoPorServicio[servicio].total += 1;

                    if (turno.estado === "esperando" || turno.estado === "en_atencion") {
                        agrupadoPorServicio[servicio].activos += 1;
                    } else if (turno.estado === "atendido") {
                        agrupadoPorServicio[servicio].atendidos += 1;
                    }
                });
                resumen.TURNOS = Object.values(agrupadoPorServicio);
                this._resumen.set(resumen);
            },
            error: (err) => {
                this._isLoading.set(false);
                this._lista_turnos.set([]);
                this.messageService.add({
                    severity: 'error',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        })
    }

    llamarTurno(usuario_id: number) {
        return this.http.post<TurnoLlamado>(`${url}/turnos/llamar`, { usuario_id });
    }

    finalizarTurno(turno_id: number, usuario_id: number) {
        return this.http.post<any>(`${url}/turnos/finalizar`, { turno_id });
    }

    transferirTurno(turno: any) {
        return this.http.post<any>(`${url}/turnos/transferir`, turno);
    }

}
