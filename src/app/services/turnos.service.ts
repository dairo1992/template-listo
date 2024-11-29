import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { url } from 'src/environments/environment';
import { TurnoGenerado } from '../interfaces/turno-generado.interface';

@Injectable({
    providedIn: 'root',
})
export class TurnosService {
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    private _lista_turnos = signal<TurnoGenerado[]>([]);
    public lista_turnos = computed(() => this._lista_turnos());
    private http = inject(HttpClient);

    constructor(private messageService: MessageService) { }

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

        return this.http.get<TurnoGenerado[]>(`${url}/turnos/${usuario_id}`).subscribe({
            next: (turnos) => {
                this._lista_turnos.set(turnos);
                this._isLoading.set(false);
            },
            error: (err) => {
                this._lista_turnos.set([]);
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        });
    }
}
