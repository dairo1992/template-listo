import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AlmacenService } from './storage.service';
import { url } from 'src/environments/environment';
import { MenuService } from '../layout/app.menu.service';
import { Usuario } from '../interfaces/usuario.interface';
import { AlertaSwal } from '../components/swal-alert';

@Injectable({
    providedIn: 'root',
})
export class AuthserviceService {
    // private _isLoading = signal<boolean>(false);
    // public isLoading = computed(() => this._isLoading());
    private http = inject(HttpClient);
    private storage = inject(AlmacenService);
    private service = inject(MenuService);
    private alert: AlertaSwal;
    constructor(
        private router: Router,
        private messageService: MessageService
    ) {
        this.alert = new AlertaSwal();
    }

    login(usuario: any) {
        this.alert.loading('Consultando tus credenciales');
        this.http.post(`${url}/auth/login`, usuario).subscribe({
            next: async (usuario: Usuario | null) => {
                if (usuario != null) {
                    await this.storage.almacenarRutas(usuario.rutas);
                    await this.storage.almacenarToken(usuario.token);
                    this.storage.almacenarDatosUsuario(usuario);
                    this.alert.close();
                    this.router.navigateByUrl('/home');
                }
                this.alert.showMessage({
                    position: "center",
                    icon: usuario != null ? 'success' : 'error',
                    title: usuario != null ? 'BIENVENIDO' : 'NOTIFICACION',
                    text: usuario != null ? `${usuario.nombre.toUpperCase()} ${usuario.apellido.toUpperCase()}` : 'USUARIO NO ENCONTRADO',
                    showConfirmButton: false,
                    timer: 1000
                });
            },
            error: (err) => {
                this.alert.close();
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
        this.alert.close();
    }
}
