import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Routes } from '../interfaces/routes.interface';
import { url } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class UtilitiesService {

    constructor(private messageService: MessageService) {
        // this.obtenerRutas();
    }

    getStatus(status: string) {
        switch (status) {
            case 'A': //ACTIVO
                return { color: 'success', nombre: 'ACTIVO' };
            case 'I': //INACTIVO
                return { color: 'danger', nombre: 'INACTIVO' };
            case 'P': //PENDIENTE
                return { color: 'info', nombre: 'PENDIENTE' };
            case 'F': //FINALIZADO
                return { color: 'help', nombre: 'FINALIZADO' };
            case 'E': //EN CURSO
                return { color: 'Primary', nombre: 'EN VISITA' };
            default: //DEFAULT
                return { color: 'warning', nombre: 'INDEFINIDO' };
        }
    }


}
