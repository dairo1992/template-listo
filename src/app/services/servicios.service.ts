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
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    private _lista_servicios = signal<Servicio[]>([]);
    public lista_servicios = computed(() => this._lista_servicios());
    private http = inject(HttpClient);
    private storage = inject(AlmacenService);
    constructor(private messageService: MessageService) { }

    obtenerServicios(id: number) {
        this._isLoading.set(true);
        this.http.get<Servicio[]>(`${url}/servicios/${id}`).subscribe({
            next: (data) => {
                this._lista_servicios.set(data);
                this._isLoading.set(false);
            },
            error: (err) => {
                this._isLoading.set(false);
                this._lista_servicios.set([]);
                this.messageService.add({
                    severity: 'error',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        });
    }

    nuevoServicio(servicio: Servicio): void {
        this._isLoading.set(true);
        this.http.post(`${url}/servicios`, servicio).subscribe({
            next: (value: Servicio) => {
                this._lista_servicios.set([
                    ...(this.lista_servicios() || []),
                    value,
                ]);
                this._isLoading.set(false);
                this.messageService.add({
                    severity: 'success',
                    summary: `${value.nombre.toUpperCase()} CREADO CORRECTAMENTE`,
                });
            },
            error: (err) => {
                this._isLoading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        });
    }

    actualizarServicio(id: number, servicio: Servicio): void {
        this._isLoading.set(true);
        this.http.patch(`${url}/servicios/${id}`, servicio).subscribe({
            next: (value: Servicio) => {
                this._isLoading.set(false);
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
                this._isLoading.update((x) => (x = false));
            },
            error: (err) => {
                this._isLoading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        });
    }

    uiEstado(servicio: Servicio): void {
        this._isLoading.set(true);
        this.http.delete(`${url}/servicios/${servicio.id}`).subscribe({
            next: (value: Servicio) => {
                this._lista_servicios.update((servicios) => {
                    servicios.find((e) => e.id == servicio.id).estado =
                        servicio.estado == 'A' ? 'I' : 'A';
                    return servicios;
                });
                this._isLoading.set(false);
                this.messageService.add({
                    severity: 'success',
                    summary: '!NOTIFICACION¡',
                    detail: `ACTUALIZADO CORRECTAMENTE`,
                });
            },
            error: (err) => {
                this._isLoading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        });
    }

    config_modulo_servicio(modulo_id: number, servicio_id: number) {
        this._isLoading.set(true);
        this.http
            .post(`${url}/servicios/config`, { modulo_id, servicio_id })
            .subscribe({
                next: (value: Servicio) => {
                    this._isLoading.set(false);
                    this.messageService.add({
                        severity: 'success',
                        summary: '!NOTIFICACION¡',
                        detail: `CONFIGURACION REALIZADA CORRECTAMENTE`,
                    });
                },
                error: (err) => {
                    this._isLoading.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: '!NOTIFICACION¡',
                        detail: err.error,
                    });
                },
            });
    }
}
