import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AlmacenService } from './storage.service';
import { url } from 'src/environments/environment';
import { MenuService } from '../layout/app.menu.service';
import { Usuario } from '../interfaces/usuario.interface';
import { AlertaSwal } from '../components/swal-alert';
import { SocketService } from './socket.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private http = inject(HttpClient);
    private storage = inject(AlmacenService);
    socketervice = inject(SocketService);
    public storageService = inject(AlmacenService);
    private alert: AlertaSwal;
    constructor(
        private router: Router,
        private messageService: MessageService
    ) {
        this.alert = new AlertaSwal();
    }

    login(usuarioForm: any) {
        this.alert.loading('Consultando tus credenciales');
        this.http.post(`${url}/auth/login`, usuarioForm).subscribe({
            next: async (usuario: Usuario | null) => {
                if (usuario != null) {
                    await this.storage.almacenarRutas(usuario.rutas);
                    await this.storage.almacenarToken(usuario.token);
                    this.storage.almacenarDatosUsuario(usuario);
                    this.recordar(usuarioForm);
                    switch (usuario.tipo_usuario) {
                        case 'SUPER_ADMIN':
                            this.router.navigateByUrl('/home/empresas');
                            break;
                        case 'EMPLEADO':
                            this.router.navigateByUrl('/home/gestion-turno');
                            break;
                        case 'TEMP':
                            this.router.navigateByUrl('/home/usuarios');
                            break;
                        case 'PANTALLA':
                            this.router.navigateByUrl('/pantalla');
                            break;
                        default:
                            this.router.navigateByUrl('/home');
                            break;
                    }
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

    recordar(formAuth: any): void {
        if (formAuth.RECORDAR) {
            this.storageService.recordarUsuario(formAuth);
        } else {
            // this.storageService.olvidarUsuario();
        }
    }

    logout(): void {
        this.socketervice.disconnect();
        this.storage.limpiarStorage();
        this.router.navigateByUrl('/');
        this.alert.close();
    }

    obtenerOrganigrama(empresa_id: number) {
        return this.http.get(`${url}/auth/organigrama/${empresa_id}`);
    }
}
