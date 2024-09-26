import { Injectable } from '@angular/core';
import {
  LocalStorageService,
  SessionStorageService,
} from 'angular-web-storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
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
    this.session.clear();
    this.storage.clear();
  }

  almacenarToken(token: String): void {
    this.session.set('token', token);
  }

  almacenarDatosUsuario(datos: any): void {
    this.storage.set('usuario', datos);
  }

  obtenerDatosUsuario() {
    return this.storage.get('usuario');
  }

  obtenerTipoUsuario(): String {
    const tipo = this.storage.get('usuario');
    return tipo.tipo_usuario;
  }
}
