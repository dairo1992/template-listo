import { computed, Inject, inject, Injectable, signal } from '@angular/core';
import { Sede } from '../interfaces/sede.interface';
import { HttpClient } from '@angular/common/http';
import { url } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { EmpresaService } from './empresa.service';

@Injectable({
    providedIn: 'root',
})
export class SedesService {
    private _lista_sedes = signal<Sede[]>([]);
    private _sede = signal<Sede>(null);
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    public lista_sedes = computed(() => this._lista_sedes());
    public sede = computed(() => this._sede());
    private http = inject(HttpClient);
    private listaEmpresas = inject(EmpresaService).lista_empresas;
    constructor(private messageService: MessageService) {
        this.obtenerSedes();
    }

    obtenerSedes(): void {
        this.http.get<Sede[]>(`${url}/sedes`).subscribe({
            next: (data) => {
                this._lista_sedes.set(data);
                this._isLoading.set(false);
            },
            error: (err) => {
                this._lista_sedes.set([]);
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `OCURRIO UN ERROR: ${err.message}`,
                });
            },
        });
    }

    nuevaSede(sede: Sede): void {
        this.http.post(`${url}/sedes`, sede).subscribe({
            next: (value: Sede) => {
                const empresa = this.listaEmpresas().find(
                    (s) => s.id == sede.empresa_id
                );
                value.empresa = empresa;
                this._lista_sedes.set([...this.lista_sedes(), value]);
                this.messageService.add({
                    severity: 'success',
                    summary: `${value.nombre.toUpperCase()} CREADO CORRECTAMENTE`,
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `OCURRIO UN ERROR: ${err.message}`,
                });
            },
        });
    }

    actualizarSede(id: number, sede: Sede): void {
        this.http.patch(`${url}/sedes/${id}`, sede).subscribe({
            next: (value: Sede) => {
                const i = this.lista_sedes().findIndex((e) => e.id == sede.id);
                this._lista_sedes.update((empresas) => {
                    empresas.splice(i);
                    empresas.push(sede);
                    return empresas;
                });
                this.messageService.add({
                    severity: 'success',
                    summary: '!NOTIFICACION¡',
                    detail: `ACTUALIZADO CORRECTAMENTE`,
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `OCURRIO UN ERROR: ${err.message}`,
                });
            },
        });
    }

    uiEstado(sede: Sede): void {
        this.http.delete(`${url}/sedes/${sede.id}`).subscribe({
            next: (value: Sede) => {
                this._lista_sedes.update((empresas) => {
                    empresas.find((e) => e.id == sede.id).estado =
                        sede.estado == 'A' ? 'I' : 'A';
                    return empresas;
                });
                this.messageService.add({
                    severity: 'success',
                    summary: '!NOTIFICACION¡',
                    detail: `ACTUALIZADO CORRECTAMENTE`,
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `OCURRIO UN ERROR: ${err.message}`,
                });
            },
        });
    }

    obtenersede(id: number): void {
        this.http.delete(`${url}/sedes/${id}`).subscribe({
            next: (sede) => this._sede.update((sede) => sede),
            error: (err) =>
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `OCURRIO UN ERROR: ${err.message}`,
                })
        });
    }
}
