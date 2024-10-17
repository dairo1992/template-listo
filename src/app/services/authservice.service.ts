import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StorageService } from './storage.service';
import { url } from 'src/environments/environment';
import { Auth } from '../interfaces/auth.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthserviceService {
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    private http = inject(HttpClient);
    private storage = inject(StorageService);
    constructor(
        private router: Router,
        private messageService: MessageService
    ) {}

    login(usuario: any) {
        const data = { usuario: usuario.USUARIO, password: usuario.PASSWORD };
        this.http.post(`${url}/usuarios/login`, data).subscribe({
            next: (value: Auth) => {
                this.storage.almacenarToken(value.access_token);
                this.storage.almacenarDatosUsuario(value.usuario);
                this.messageService.add({
                    severity: 'success',
                    summary: `BIENVENIDO`,
                    detail: `${value.usuario.nombre.toUpperCase()}`,
                });
                this.router.navigateByUrl('/');
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

    logout(): void {
        this.storage.limpiarStorage();
        this.router.navigateByUrl('/auth');
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Token Expirado',
        });
    }
}
