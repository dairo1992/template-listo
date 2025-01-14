import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PantallaAdminService {
  private http = inject(HttpClient);

  constructor() { }


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

}
