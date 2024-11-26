import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { url } from 'src/environments/environment';
import { Cliente } from '../interfaces/cliente.interface';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class ClienteService {
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    public _lista_clientes = signal<Cliente[]>([]);
    public lista_clientes = computed(() => this._lista_clientes());
    public _cliente = signal<Cliente>(null);
    public cliente = computed(() => this._cliente());
    private http = inject(HttpClient);

    constructor(private messageService: MessageService) {}

    setLoading(value: boolean) {
        this._isLoading.set(value);
    }

    obtenerClientes(empresa_id: number) {
        this.http.get<Cliente[]>(`${url}/clientes/${empresa_id}`).subscribe({
            next: (data) => {
                this._isLoading.set(false);
                this._lista_clientes.set(data);
            },
            error: (err) => {
                this._lista_clientes.set([]);
                this._isLoading.set(false);
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        });
    }

    consultarCliente(query: any): Observable<Cliente> {
        this._cliente.update((c) => (c = null));
        return this.http.post<Cliente>(`${url}/clientes/consultar`, query);
    }

    nuevoCliente(cliente: Cliente): Observable<Cliente> {
        const fecha = cliente.fecha_nacimiento;
        cliente.fecha_nacimiento = formatDate(
            new Date(fecha),
            'yyyy-MM-dd',
            'en-US'
        );
        return this.http.post<Cliente>(`${url}/clientes`, cliente);
    }

    // actualizarUsuario(id: number, usuario: any): void {
    //     this.http.patch(`${url}/usuarios/${id}`, usuario).subscribe({
    //         next: (value: any) => {
    //             const i = this.lista_usuarios().findIndex((e) => e.id == id);
    //             this._lista_usuarios.update((usuarios) => {
    //                 const emp = this.empresas
    //                     .lista_empresas()
    //                     .find((e) => e.id == usuario.empresa_id);
    //                 usuarios.splice(i, 1);
    //                 usuario.empresa = emp;
    //                 usuarios.push(usuario);
    //                 return usuarios;
    //             });
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: '!NOTIFICACION¡',
    //                 detail: value,
    //             });
    //         },
    //         error: (err) => {
    //             this.messageService.add({
    //                 severity: 'warn',
    //                 summary: '!NOTIFICACION¡',
    //                 detail: err.error,
    //             });
    //         },
    //     });
    // }

    // uiEstado(usuario: Usuario): void {
    //     this.http.delete(`${url}/usuarios/${usuario.id}`).subscribe({
    //         next: (value: Usuario) => {
    //             this._lista_usuarios.update((empresas) => {
    //                 empresas.find((e) => e.id == usuario.id).estado =
    //                     usuario.estado == 'A' ? 'I' : 'A';
    //                 return empresas;
    //             });
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: '!NOTIFICACION¡',
    //                 detail: `ACTUALIZADO CORRECTAMENTE`,
    //             });
    //         },
    //         error: (err) => {
    //             this.messageService.add({
    //                 severity: 'warn',
    //                 summary: '!NOTIFICACION¡',
    //                 detail: err.error,
    //             });
    //         },
    //     });
    // }
}
