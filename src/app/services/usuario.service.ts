import { computed, inject, Injectable, signal } from '@angular/core';
import { Usuario } from '../interfaces/usuario.interface';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { url } from 'src/environments/environment';
import { AlertaSwal } from '../components/swal-alert';

@Injectable({
    providedIn: 'root',
})
export class UsuarioService {
    public _currentUser = signal<Usuario>(null);
    public currentUser = computed(() => this._currentUser());
    public _lista_usuarios = signal<Usuario[]>([]);
    public lista_usuarios = computed(() => this._lista_usuarios());
    private http = inject(HttpClient);
    private alert: AlertaSwal;

    constructor(private messageService: MessageService) {
        this.alert = new AlertaSwal();
    }

    setUsuario(usuario: Usuario | null) {
        this._currentUser.set(usuario);
    }

    obtenerUsuarios(id: number) {
        return this.http.get<Usuario[]>(`${url}/usuarios/${id}`);
    }

    nuevaUsuario(usuario: Usuario) {
        return this.http.post(`${url}/usuarios/register`, usuario);
    }

    actualizarUsuario(id: number, usuario: any) {
        return this.http.patch(`${url}/usuarios/${id}`, usuario)
    }

    uiEstado(usuario: Usuario) {
        return this.http.delete(`${url}/usuarios/${usuario.id}`);
    }

    cambiarPassword(password: any, id: number) {
        return this.http
            .post(`${url}/usuarios/password`, {
                password: password.password,
                id,
            });

    }

    obt_modulos(id_usuario: number) {
        return this.http.get(`${url}/usuarios/menus/${id_usuario}`);
    }

    actualizarmodulos(id: number, modulos: any) {
        return this.http.post(`${url}/usuarios/menu/${id}`, modulos)
    }

    configurarTurno(config: any) {
        this.alert.loading();
        return this.http.post(`${url}/usuarios/config`, config);
    }

    obtenerMenuOptions() {
        return this.http.get('../assets/JSON/optionsMenuUsuario.json');
    }


}
