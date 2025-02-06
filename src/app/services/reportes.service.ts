import { formatDate } from '@angular/common';
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
    data.fecha_fin = data.fecha_fin != null ? formatDate(new Date(data.fecha_fin), 'yyyy-MM-dd', 'en-US') : null;
    data.fecha_inicio = data.fecha_inicio != null ? formatDate(new Date(data.fecha_inicio), 'yyyy-MM-dd', 'en-US') : null;
    return this.http.post(`${url}/reportes`, data);
  }

  descargarReporte(data: any) {
    return this.http.post(`${url}/reportes/descargarReporte`, data);
  }

}
