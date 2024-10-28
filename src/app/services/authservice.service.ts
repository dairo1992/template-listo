import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StorageService } from './storage.service';
import { url } from 'src/environments/environment';
import { Auth } from '../interfaces/auth.interface';
import { MenuService } from '../layout/app.menu.service';

@Injectable({
    providedIn: 'root',
})
export class AuthserviceService {
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    private http = inject(HttpClient);
    private storage = inject(StorageService);
    private service = inject(MenuService);
    constructor(
        private router: Router,
        private messageService: MessageService
    ) {}

    login(usuario: any) {
        const data = { usuario: usuario.USUARIO, password: usuario.PASSWORD };
        this.http.post(`${url}/usuarios/login`, data).subscribe({
            next: async (value: Auth | any) => {
                if (!value.hasOwnProperty('status')) {
                    await this.storage.almacenarToken(value.access_token);
                    this.storage.almacenarDatosUsuario(value.usuario);
                    this.service.obtenerRutas(value.usuario.id);
                    this.router.navigateByUrl('/home');
                }

                this.messageService.add({
                    severity: value.hasOwnProperty('status')
                        ? 'error'
                        : 'success',
                    summary: value.hasOwnProperty('status')
                        ? '!NOTIFICACION¡'
                        : 'BIENVENIDO',
                    detail: value.hasOwnProperty('status')
                        ? value.message
                        : `${value.usuario.nombre.toUpperCase()}`,
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

    logout(): void {
        this.storage.limpiarStorage();
        this.router.navigateByUrl('/');
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Token Expirado',
        });
    }
}
