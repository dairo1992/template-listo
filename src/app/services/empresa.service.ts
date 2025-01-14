import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Empresa } from '../interfaces/empresa.interface';
import { url } from 'src/environments/environment';
import { AlertaSwal } from '../components/swal-alert';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EmpresaService {
    private http = inject(HttpClient);
    public _lista_empresas = signal<Empresa[]>([]);
    public lista_empresas = computed(() => this._lista_empresas());
    constructor() {
    }

    obtenerEmpresas(id_user: number): Observable<Empresa[]> {
        return this.http.get<Empresa[]>(`${url}/empresas/${id_user}`);
    }

    nuevaEmpresa(empresa: Empresa) {
        return this.http.post(`${url}/empresas`, empresa)
    }

    actualizarEmpresa(id: number, empresa: Empresa) {
        return this.http.patch(`${url}/empresas/${id}`, empresa);
    }

    uiEstado(empresa: Empresa) {
        return this.http.delete(`${url}/empresas/${empresa.id}`);
    }
}

