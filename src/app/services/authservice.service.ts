import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AlmacenService } from './storage.service';
import { url } from 'src/environments/environment';
import { MenuService } from '../layout/app.menu.service';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthserviceService {
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    private http = inject(HttpClient);
    private storage = inject(AlmacenService);
    private service = inject(MenuService);
    constructor(
        private router: Router,
        private messageService: MessageService
    ) {}

    login(usuario: any) {
        this.http.post(`${url}/auth/login`, usuario).subscribe({
            next: async (usuario: Usuario) => {
                await this.storage.almacenarToken(usuario.token);
                this.storage.almacenarDatosUsuario(usuario);
                this.service.obtenerRutas(usuario.id);
                this.router.navigateByUrl('/home');
                this.messageService.add({
                    severity: 'success',
                    summary: 'BIENVENIDO',
                    detail: `${usuario.nombre.toUpperCase()}`,
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
