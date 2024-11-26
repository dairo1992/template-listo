import { computed, inject, Injectable, signal } from '@angular/core';
import { Usuario } from '../interfaces/usuario.interface';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { url } from 'src/environments/environment';
import { EmpresaService } from './empresa.service';

@Injectable({
    providedIn: 'root',
})
export class UsuarioService {
    private _currentUser = signal<Usuario>(null);
    public currentUser = computed(() => this._currentUser());
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    private _lista_usuarios = signal<Usuario[]>([]);
    public lista_usuarios = computed(() => this._lista_usuarios());
    private http = inject(HttpClient);
    private empresas = inject(EmpresaService);

    constructor(private messageService: MessageService) {}

    setUsuario(usuario: Usuario | null) {
        this._currentUser.set(usuario);
    }

    obtenerUsuarios(id: number): void {
        this.http.get<Usuario[]>(`${url}/usuarios/${id}`).subscribe({
            next: (data) => {
                this._isLoading.set(false);
                this._lista_usuarios.set(data);
            },
            error: (err) => {
                this._lista_usuarios.set([]);
                this._isLoading.set(false);
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        });
    }

    nuevaUsuario(usuario: Usuario): void {
        this.http.post(`${url}/usuarios/register`, usuario).subscribe({
            next: (value: Usuario) => {
                this._lista_usuarios.set([
                    ...(this.lista_usuarios() || []),
                    value,
                ]);
                this.messageService.add({
                    severity: 'success',
                    summary: `${value.nombre.toUpperCase()} CREADO CORRECTAMENTE`,
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

    actualizarUsuario(id: number, usuario: any): void {
        this.http.patch(`${url}/usuarios/${id}`, usuario).subscribe({
            next: (value: any) => {
                const i = this.lista_usuarios().findIndex((e) => e.id == id);
                this._lista_usuarios.update((usuarios) => {
                    const emp = this.empresas
                        .lista_empresas()
                        .find((e) => e.id == usuario.empresa_id);
                    usuarios.splice(i, 1);
                    usuario.empresa = emp;
                    usuarios.push(usuario);
                    return usuarios;
                });
                this.messageService.add({
                    severity: 'success',
                    summary: '!NOTIFICACION¡',
                    detail: value,
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
            error: (err) => {
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        });
    }

    cambiarPassword(password: any, id: number) {
        this.http
            .post(`${url}/usuarios/password`, {
                password: password.password,
                id,
            })
            .subscribe({
                next: (response: any) => {
                    console.log(response);

                    this.messageService.add({
                        severity: response.STATUS ? 'success' : 'error',
                        summary: '!NOTIFICACION¡',
                        detail: response.MSG,
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

    obt_modulos(id_usuario: number) {
        return this.http.get(`${url}/usuarios/menus/${id_usuario}`);
    }

    actualizarmodulos(id: number, modulos: any) {
        this.http.post(`${url}/usuarios/menu/${id}`, modulos).subscribe({
            next: (value: Usuario) => {
                console.log(value);
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

    configurarTurno(config: any) {
        this.http.post(`${url}/usuarios/config`, config).subscribe({
            next: (response: any) => {
                this.messageService.add({
                    severity: response.STATUS ? 'success' : 'error',
                    summary: '!NOTIFICACION¡',
                    detail: response.MSG,
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
