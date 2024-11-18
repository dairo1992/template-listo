import { computed, inject, Injectable, signal } from '@angular/core';
import {
    LocalStorageService,
    SessionStorageService,
} from 'angular-web-storage';
import * as CryptoJS from 'crypto-js';
import { cryptoKey } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario.interface';
import { UsuarioService } from './usuario.service';

@Injectable({
    providedIn: 'root',
})
export class AlmacenService {
    private _token = signal<String>('');
    public token = computed(() => this._token());
    private usuarioService = inject(UsuarioService);

    constructor(
        private session: SessionStorageService,
        private storage: LocalStorageService
    ) {}

    recordarUsuario(data: any) {
        this.session.set('usuario', data);
    }

    olvidarUsuario() {
        this.session.remove('usuario');
    }

    obtenerUsuario(): string | null {
        return this.session.get('usuario');
    }

    obtenerToken(): string | null {
        return this.session.get('token');
    }

    limpiarStorage(): void {
        this.session.remove('token');
        this.storage.clear();
        this.usuarioService.setUsuario(null);
    }

    async almacenarToken(token: String): Promise<boolean> {
        this.session.set('token', token);
        this._token.set(token);
        return true;
    }

    almacenarDatosUsuario(datos: Usuario): void {
        this.usuarioService.setUsuario(datos);
        const dataEncrypted = CryptoJS.AES.encrypt(
            JSON.stringify(datos),
            cryptoKey
        ).toString();
        this.storage.set('usuario', dataEncrypted);
    }

    almacenarRutaActual(ruta: string) {
        this.storage.set('currentURL', ruta);
    }

    obtenerRutaActual(): string {
        return this.storage.get('currentURL');
    }

    obtenerDatosUsuario(): Usuario {
        const dataEncrypted = this.storage.get('usuario');
        if (dataEncrypted) {
            this._token.set(this.session.get('token'));
            if (dataEncrypted) {
                const decryptData = CryptoJS.AES.decrypt(
                    dataEncrypted,
                    cryptoKey
                ).toString(CryptoJS.enc.Utf8);
                this.usuarioService.setUsuario(JSON.parse(decryptData));
                return JSON.parse(decryptData);
            }
            return null;
        }
        return null;
    }

    obtenerTipoUsuario(): String {
        const tipo = this.storage.get('usuario');
        return tipo.tipo_usuario;
    }

    limpiarItem(key: string) {
        if (key == '') return null;
        this.storage.remove(key);
    }
}
