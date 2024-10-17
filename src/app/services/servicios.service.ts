import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Servicio } from '../interfaces/servicio.interface';
import { url } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ServiciosService {
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    private _lista_servicios = signal<Servicio[]>([]);
    public lista_servicios = computed(() => this._lista_servicios());
    private http = inject(HttpClient);
    constructor(private messageService: MessageService) {
        this.obtenerServicios();
    }

    obtenerServicios() {
        this.http.get<Servicio[]>(`${url}/servicios`).subscribe({
            next: (data) => {
                this._lista_servicios.set(data);
                this._isLoading.set(false);
            },
            error: (err) => {
                this._lista_servicios.set([]);
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `OCURRIO UN ERROR: ${err.message}`,
                });
            },
        });
    }

    nuevoServicio(servicio: Servicio): void {
        this.http.post(`${url}/servicios`, servicio).subscribe({
            next: (value: Servicio) => {
                this._lista_servicios.set([...this.lista_servicios(), value]);
                this.messageService.add({
                    severity: 'success',
                    summary: `${value.nombre.toUpperCase()} CREADO CORRECTAMENTE`,
                });
            },
            error(err) {
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `OCURRIO UN ERROR: ${err.message}`,
                });
            },
        });
    }

    actualizarServicio(id: number, servicio: Servicio): void {
        this.http.patch(`${url}/servicios/${id}`, servicio).subscribe({
            next: (value: Servicio) => {
                const i = this.lista_servicios().findIndex(
                    (e) => e.id == servicio.id
                );
                this._lista_servicios.update((empresas) => {
                    empresas.splice(i);
                    empresas.push(servicio);
                    return empresas;
                });
                this.messageService.add({
                    severity: 'success',
                    summary: '!NOTIFICACION¡',
                    detail: `ACTUALIZADO CORRECTAMENTE`,
                });
            },
            error(err) {
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `OCURRIO UN ERROR: ${err.message}`,
                });
            },
        });
    }

    uiEstado(servicio: Servicio): void {
        this.http.delete(`${url}/servicios/${servicio.id}`).subscribe({
            next: (value: Servicio) => {
                this._lista_servicios.update((servicios) => {
                    servicios.find((e) => e.id == servicio.id).estado =
                        servicio.estado == 'A' ? 'I' : 'A';
                    return servicios;
                });
                this.messageService.add({
                    severity: 'success',
                    summary: '!NOTIFICACION¡',
                    detail: `ACTUALIZADO CORRECTAMENTE`,
                });
            },
            error(err) {
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `OCURRIO UN ERROR: ${err.message}`,
                });
            },
        });
    }

    config_modulo_servicio(modulo_id: number, servicio_id: number) {
        this.http
            .post(`${url}/config-modulo-servicios`, { modulo_id, servicio_id })
            .subscribe({
                next: (value: Servicio) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: '!NOTIFICACION¡',
                        detail: `CONFIGURACION REALIZADA CORRECTAMENTE`,
                    });
                },
                error(err) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: '!NOTIFICACION¡',
                        detail: `OCURRIO UN ERROR: ${err.message}`,
                    });
                },
            });
    }
}
