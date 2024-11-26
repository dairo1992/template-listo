import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { url } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TurnosService {
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    // private _lista_servicios = signal<Servicio[]>([]);
    // public lista_servicios = computed(() => this._lista_servicios());
    private http = inject(HttpClient);

    constructor(private messageService: MessageService) {}

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
}
