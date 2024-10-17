import { computed, inject, Injectable, signal } from '@angular/core';
import { Usuario } from '../interfaces/usuario.interface';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { url } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UsuarioService {
    private _lista_usuarios = signal<Usuario[]>([]);
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    public lista_usuarios = computed(() => this._lista_usuarios());
    private http = inject(HttpClient);

    constructor(private messageService: MessageService) {
        this.obtenerUsuarios();
    }

    obtenerUsuarios(): void {
        this.http.get<Usuario[]>(`${url}/usuarios`).subscribe({
            next: (data) => {
                console.log(data);
                this._isLoading.set(false);
                this._lista_usuarios.set(data);
            },
            error: (err) => {
                this._lista_usuarios.set([]);
                this._isLoading.set(false);
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: `${err.error.error}`,
                });
            },
        });
    }

    nuevaUsuario(usuario: Usuario): void {
        this.http.post(`${url}/usuarios/register`, usuario).subscribe({
            next: (value: Usuario) => {
                this._lista_usuarios.set([...this.lista_usuarios(), value]);
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

    actualizarUsuario(id: number, usuario: Usuario): void {
        this.http.patch(`${url}/usuarios/${id}`, usuario).subscribe({
            next: (value: Usuario) => {
                const i = this.lista_usuarios().findIndex(
                    (e) => e.id == usuario.id
                );
                this._lista_usuarios.update((usuarios) => {
                    usuarios.splice(i);
                    usuarios.push(value);
                    return usuarios;
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

    uiEstado(usuario: Usuario): void {
        this.http.delete(`${url}/usuarios/${usuario.id}`).subscribe({
            next: (value: Usuario) => {
                this._lista_usuarios.update((empresas) => {
                    empresas.find((e) => e.id == usuario.id).estado =
                        usuario.estado == 'A' ? 'I' : 'A';
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
}
