import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Modulo } from '../interfaces/modulo.interface';
import { url } from 'src/environments/environment';
import { SedesService } from './sedes.service';
import { AlertaSwal } from '../components/swal-alert';

@Injectable({
    providedIn: 'root',
})
export class ModuloService {
    public _lista_modulos = signal<Modulo[]>([]);
    public lista_modulos = computed(() => this._lista_modulos());
    private http = inject(HttpClient);
    private alert: AlertaSwal;

    constructor(private messageService: MessageService) {
        this.alert = new AlertaSwal();
    }

    obtenerModulos(id: number) {
        return this.http.get<Modulo[]>(`${url}/modulos/${id}`)
    }

    nuevoModulo(modulo: Modulo) {
        return this.http.post(`${url}/modulos`, modulo);
    }

    actualizarModulo(id: number, modulo: Modulo) {
        return this.http.patch(`${url}/modulos/${id}`, modulo);
    }

    uiEstado(sede: Modulo) {
        return this.http.delete(`${url}/modulos/${sede.id}`);
    }

    uiMenu(json: any) {
        this.http.post(`${url}/auth/gestion_menu`, json).subscribe({
            next: (value) => {
                this.alert.close();
            },
            error: (err) => {
                this.alert.close();
            },
        });
    }

    configModuloServicio(data: any, modulo_id: number) {
        return this.http.post(`${url}/modulos/config`, ({ data, modulo_id }));
    }
}
