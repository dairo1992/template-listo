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
    private _isLoading = signal<boolean>(false);
    public isLoading = computed(() => this._isLoading());
    private http = inject(HttpClient);
    private storage = inject(AlmacenService);
    private service = inject(MenuService);
    constructor(
        private router: Router,
        private messageService: MessageService
    ) { }

    login(usuario: any) {
        this._isLoading.set(true);
        this.http.post(`${url}/auth/login`, usuario).subscribe({
            next: async (usuario: Usuario | null) => {
                if (usuario != null) {
                    await this.storage.almacenarRutas(usuario.rutas);
                    await this.storage.almacenarToken(usuario.token);
                    this.storage.almacenarDatosUsuario(usuario);
                    this._isLoading.set(false);
                    this.router.navigateByUrl('/home');
                }
                this.messageService.add({
                    severity: usuario != null ? 'success' : 'error',
                    summary: usuario != null ? 'BIENVENIDO' : 'NOTIFICACION',
                    detail: usuario != null ? `${usuario.nombre.toUpperCase()}` : 'USUARIO NO ENCONTRADO',
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
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
        this._isLoading.set(false);
    }
}
