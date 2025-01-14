import { computed, Inject, inject, Injectable, signal } from '@angular/core';
import { Sede } from '../interfaces/sede.interface';
import { HttpClient } from '@angular/common/http';
import { url } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { AlmacenService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class SedesService {
    public _lista_sedes = signal<Sede[]>([]);
    public lista_sedes = computed(() => this._lista_sedes());
    public _sede = signal<Sede>(null);
    public sede = computed(() => this._sede());
    private http = inject(HttpClient);

    constructor(private messageService: MessageService) { }

    obtenerSedes(id: number) {
        return this.http.get<Sede[]>(`${url}/sedes/${id}`)

    }

    nuevaSede(sede: Sede) {
        return this.http.post(`${url}/sedes`, sede);
    }

    actualizarSede(id: number, sede: Sede) {
        return this.http.patch(`${url}/sedes/${id}`, sede);
    }

    uiEstado(sede: Sede) {
        return this.http.delete(`${url}/sedes/${sede.id}`);
    }

    obtenersede(id: number) {
        return this.http.get(`${url}/sedes/${id}`);
        // .subscribe({
        //     next: (sede) => {
        //         this._sede.update((sede) => sede)
        //     },
        //     error: (err) => {
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: '!NOTIFICACION¡',
        //             detail: err.error,
        //         })
        //     }
        // });
    }
}
