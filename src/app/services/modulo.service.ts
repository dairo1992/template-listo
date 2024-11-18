import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Modulo } from '../interfaces/modulo.interface';
import { url } from 'src/environments/environment';
import { SedesService } from './sedes.service';
import { AlmacenService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class ModuloService {
    private _lista_modulos = signal<Modulo[]>([]);
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    public lista_modulos = computed(() => this._lista_modulos());
    private lista_sedes = inject(SedesService).lista_sedes;
    private http = inject(HttpClient);
    private storageService = inject(AlmacenService);
    // private listaEmpresas = inject(EmpresaService).lista_empresas;
    constructor(private messageService: MessageService) {
        // this.obtenerModulos(this.storageService.currentUser().id);
    }

    obtenerModulos(id: number): void {
        this.http.get<Modulo[]>(`${url}/modulos/${id}`).subscribe({
            next: (data) => {
                // const lista = data.map<Modulo>((m) => {
                //     m.
                //     return m;
                // });
                this._lista_modulos.set(data);
                this._isLoading.set(false);
            },
            error: (err) => {
                this._lista_modulos.set([]);
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `OCURRIO UN ERROR: ${err.error}`,
                });
            },
        });
    }

    nuevoModulo(modulo: Modulo): void {
        this.http.post(`${url}/modulos`, modulo).subscribe({
            next: (value: Modulo) => {
                const sede = this.lista_sedes().find(
                    (m) => m.id == modulo.sede_id
                );
                value.sede = sede;
                this._lista_modulos.set([...this.lista_modulos(), value]);
                this.messageService.add({
                    severity: 'success',
                    summary: `${value.nombre.toUpperCase()} CREADO CORRECTAMENTE`,
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `OCURRIO UN ERROR: ${err.error}`,
                });
            },
        });
    }

    actualizarModulo(id: number, modulo: Modulo): void {
        this.http.patch(`${url}/modulos/${id}`, modulo).subscribe({
            next: (value: any) => {
                const i = this.lista_modulos().findIndex(
                    (e) => e.id == modulo.id
                );
                this._lista_modulos.update((empresas) => {
                    empresas.splice(i);
                    const sed = this.lista_sedes().find(
                        (s) => s.id == modulo.sede_id
                    );
                    modulo.sede = sed;
                    empresas.push(modulo);
                    return empresas;
                });
                this.messageService.add({
                    severity: value.STATUS ? 'success' : 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: value.MSG,
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `OCURRIO UN ERROR: ${err.error}`,
                });
            },
        });
    }

    uiEstado(sede: Modulo): void {
        this.http.delete(`${url}/modulos/${sede.id}`).subscribe({
            next: (value: Modulo) => {
                this._lista_modulos.update((empresas) => {
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
                    detail: `OCURRIO UN ERROR: ${err.error}`,
                });
            },
        });
    }

    uiMenu(json: any) {
        // implementando guardado de nuevos menus y modulos (incompleta)
        this.http.patch(`${url}/menu/${0}`, json).subscribe({
            next: (value) => {
                this.messageService.add({
                    severity: 'success',
                    summary: '!NOTIFICACION¡',
                    detail: `ACTUALIZADO CORRECTAMENTE`,
                });
            },
            error: (err) => {
                console.log(err);

                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `OCURRIO UN ERROR: ${err.error}`,
                });
            },
        });
    }
}
