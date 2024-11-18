import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import { MessageService } from 'primeng/api';
import { ConfigUser } from 'src/app/interfaces/config-usuarios.interface';
import { url } from 'src/environments/environment';
import { AlmacenService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class ConfigUsuariosService {
    private _isLoading = signal<boolean>(true);
    public isLoading = computed(() => this._isLoading());
    private _lista_usuarios = signal<ConfigUser[]>([]);
    public lista_usuarios = computed(() => this._lista_usuarios());
    private http = inject(HttpClient);
    private message = inject(MessageService);
    private storage = inject(AlmacenService);
    constructor() {
        // let id = this.storage.currentUser().id;
        // this.obtenerUsuarios(id);
    }

    obtenerUsuarios(usuario_id: number): void {
        this.http
            .get<ConfigUser[]>(`${url}/configuracion-modulos/${usuario_id}`)
            .subscribe({
                next: (data) => {
                    this._isLoading.set(false);
                    this._lista_usuarios.set(data);
                },
                error: (err) => {
                    this._lista_usuarios.set([]);
                    this._isLoading.set(false);
                    this.message.add({
                        severity: 'warn',
                        summary: '!NOTIFICACION¡',
                        detail: `${err.error.error}`,
                    });
                },
            });
    }
}
