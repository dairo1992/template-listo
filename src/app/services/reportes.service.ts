import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private http = inject(HttpClient);
  constructor() { }

  obtenerReportes(data: any) {
    return this.http.post(`${url}/reportes`, data);
  }

  descargarReporte(data: any) {
    return this.http.post(`${url}/reportes/descargarReporte`, data);
  }

}
