import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from "socket.io-client";
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  private usuarioService = inject(UsuarioService);
  private isConnected$ = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  private connectToSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io('https://socket-digiturno.onrender.com', {
          auth: {
            user_id: this.usuarioService.currentUser().id,
            empresa_id: this.usuarioService.currentUser().empresa.id,
            sede_id: this.usuarioService.currentUser().empresa.sede.id
          },
          transports: ['websocket'],
        });

        this.socket.on('connect', () => {
          this.isConnected$.next(true);
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          this.isConnected$.next(false);
          reject(error);
        });

        this.socket.on('disconnect', () => {
          this.isConnected$.next(false);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async conectarSocket() {
    if (!this.socket || !this.socket.connected) {
      await this.connectToSocket();
    }
    return this.isConnected$.value;
  }

  // Escuchar un evento
  public listen<T>(eventName: string): Observable<T> {
    return new Observable((subscriber) => {
      if (!this.socket?.connected) {
        this.conectarSocket().then(() => {
          this.socket.on(eventName, (data: T) => {
            subscriber.next(data);
          });
        });
      } else {
        this.socket.on(eventName, (data: T) => {
          subscriber.next(data);
        });
      }

      // Limpia el listener al cancelar la suscripción
      return () => this.socket?.off(eventName);
    });
  }

  // Emitir un evento
  public async emit(eventName: string, data: any): Promise<void> {
    if (!this.socket?.connected) {
      await this.conectarSocket();
    }
    this.socket.emit(eventName, data);
  }

  // Obtener estado de conexión
  public getConnectionStatus(): Observable<boolean> {
    return this.isConnected$.asObservable();
  }

  // Desconectar el socket
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected$.next(false);
    }
  }
}