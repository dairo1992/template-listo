import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Empresa } from '../interfaces/empresa.interface';
import { url } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class EmpresaService {
    private _lista_empresas = signal<Empresa[]>([]);
    public lista_empresas = computed(() => this._lista_empresas());
    public isLoading = computed(() => this._isLoading());
    private _isLoading = signal<boolean>(true);
    private http = inject(HttpClient);
    constructor(private messageService: MessageService) {}

    obtenerEmpresas(id: number): void {
        this.http.get<Empresa[]>(`${url}/empresas/${id}`).subscribe({
            next: (data) => {
                this._lista_empresas.set(data);
                this._isLoading.set(false);
            },
            error: (err) => {
                this._lista_empresas.set([]);
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        });
    }

    nuevaEmpresa(empresa: Empresa): void {
        this.http.post(`${url}/empresas`, empresa).subscribe({
            next: (nuevaEmpresa: Empresa) => {
                this._lista_empresas.set([
                    ...(this._lista_empresas() || []),
                    nuevaEmpresa,
                ]);
                this.messageService.add({
                    severity: 'success',
                    summary: `${nuevaEmpresa.nombre.toUpperCase()} CREADO CORRECTAMENTE`,
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        });
    }

    actualizarEmpresa(id: number, empresa: Empresa): void {
        this.http.patch(`${url}/empresas/${id}`, empresa).subscribe({
            next: (value: Empresa) => {
                const i = this.lista_empresas().findIndex(
                    (e) => e.id == empresa.id
                );
                this._lista_empresas.update((empresas) => {
                    empresas.splice(i);
                    empresas.push(empresa);
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
                    detail: err.error,
                });
            },
        });
    }

    uiEstado(empresa: Empresa): void {
        this.http.delete(`${url}/empresas/${empresa.id}`).subscribe({
            next: (value: any) => {
                if (value.STATUS) {
                    this._lista_empresas.update((empresas: any) => {
                        empresas.find((e) => e.id == empresa.id).estado =
                            empresa.estado == 'A' ? 'I' : 'A';
                        return empresas;
                    });
                }
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
                    detail: err.error,
                });
            },
        });
    }
}
