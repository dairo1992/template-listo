import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Servicio } from '../interfaces/servicio.interface';
import { url } from 'src/environments/environment';
import { AlmacenService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class ServiciosService {
    public _lista_servicios = signal<Servicio[]>([]);
    public lista_servicios = computed(() => this._lista_servicios());
    private http = inject(HttpClient);
    constructor(private messageService: MessageService) { }

    obtenerServicios(id: number) {
        return this.http.get<Servicio[]>(`${url}/servicios/${id}`)
    }

    obtenerServiciosConfig(empresa_id: number, modulo_id: number, sede_id: number) {
        return this.http.post<any>(`${url}/servicios/servicios_config`, { empresa_id, modulo_id, sede_id });
    }

    nuevoServicio(servicio: Servicio) {
        return this.http.post(`${url}/servicios`, servicio);
    }

    actualizarServicio(id: number, servicio: Servicio) {
        return this.http.patch(`${url}/servicios/${id}`, servicio);
    }

    uiEstado(servicio: Servicio) {
        return this.http.delete(`${url}/servicios/${servicio.id}`);
    }

    config_modulo_servicio(modulo_id: number, servicio_id: number) {
        return this.http
            .post(`${url}/servicios/config`, { modulo_id, servicio_id });
    }
}
