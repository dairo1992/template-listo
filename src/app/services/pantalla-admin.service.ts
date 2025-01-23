import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { url } from 'src/environments/environment';
import { SocketService } from './socket.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PantallaAdminService implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private socketService = inject(SocketService);
  public data: any;
  private subscriptions: Subscription = new Subscription();

  constructor() { }

  ngOnInit(): void {
    // Escuchar los datos en tiempo real
    const sub = this.socketService.listen<any>('turnos-list').subscribe((data) => {
      this.data = data;
      console.log('Datos actualizados:', data);
    });

    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    // Cancelar todas las suscripciones al destruir el componente
    this.subscriptions.unsubscribe();
  }

  cargarImagenes(empresa_id: number, files: File[]) {
    const formData = new FormData();
    formData.append('empresa_id', `${empresa_id}`);
    for (const file of files) {
      formData.append('archivos[]', file);
    }
    return this.http.post(`${url}/admin-pantalla`, formData);
  }

  obtenerImagenes(empresa_id: number) {
    return this.http.get(`${url}/admin-pantalla/${empresa_id}`);
  }

  obtenerPauta(empresa_id: number) {
    return this.http.post(`${url}/admin-pantalla/pautas/${empresa_id}`, empresa_id);
  }

  nuevaPauta(pauta: any) {
    return this.http.post(`${url}/admin-pantalla/nueva_pauta`, pauta);
  }

}
