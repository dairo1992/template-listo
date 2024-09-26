import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Area } from 'src/app/interfaces/area-interface';
import { Cargo } from 'src/app/interfaces/cargo-interface';
import { DbResponse } from 'src/app/interfaces/response-interface';
import { url } from 'src/environments/environment';
import { UtilityService } from '../utility.service';
import { Sede } from 'src/app/interfaces/sede-interface';
import { Persona } from 'src/app/interfaces/persona-interface';

@Injectable({
    providedIn: 'root',
})
export class TalentoHumanoService {
    public areas = signal<Area[]>([]);
    public cargos = signal<Cargo[]>([]);
    public sedes = signal<Sede[]>([]);
    public personas = signal<Persona[]>([]);
    utilityService = inject(UtilityService);
    constructor(private http: HttpClient) {}

    cambiarEstado(tipo: string, area?: Area, cargo?: Cargo, sede?: Sede) {
        this.utilityService.loading.set(true);
        return this.http.put<DbResponse>(
            `${url}/cambiar-estado`,
            tipo == 'A'
                ? { TIPO: tipo, AREA: area }
                : tipo == 'C'
                ? { TIPO: tipo, CARGO: cargo }
                : { TIPO: tipo, SEDE: sede }
        );
    }

    nuevaArea(area: String) {
        this.utilityService.loading.set(true);
        return this.http
            .post<DbResponse>(`${url}/set-area`, area)
            .subscribe((r) => this.utilityService.loading.set(false));
    }

    obtenerAreas(): void {
        this.utilityService.loading.set(true);
        this.http.get<DbResponse>(`${url}/get-areas`).subscribe((r) => {
            this.areas.set(r.DATA);
            this.utilityService.loading.set(false);
        });
    }

    nuevaCargo(cargo: any) {
        return this.http.post<DbResponse>(`${url}/set-cargo`, cargo);
    }

    obtenerCargos(area: number): void {
        this.utilityService.loading.set(true);
        this.http
            .get<DbResponse>(`${url}/get-cargos?AREA=${area}`)
            .subscribe((r) => {
                this.cargos.set(r.DATA);
                this.utilityService.loading.set(false);
            });
    }

    nuevaSede(sede: any) {
        this.utilityService.loading.set(true);
        return this.http.post<DbResponse>(`${url}/set-sede`, sede);
    }

    obtenerSedes(): void {
        this.utilityService.loading.set(true);
        this.http.get<DbResponse>(`${url}/get-sedes`).subscribe((r) => {
            this.sedes.set(r.DATA);
            this.utilityService.loading.set(false);
        });
    }

    nuevaPersona(persona: Persona) {
        return this.http.post<DbResponse>(`${url}/nueva-persona`, persona);
    }

    obtenerPersonas(): void {
        this.utilityService.loading.set(true);
        this.http.get<DbResponse>(`${url}/get-personas`).subscribe((r) => {
            this.utilityService.loading.set(false);
            this.personas.set(r.DATA);
        });
    }

    obtenerJefes(): void {}

    get_tipoContrato(tipo: string) {
        return this.utilityService
            .tiposContratos()
            .find((t) => t.CODIGO == tipo);
    }

    cambiarEstadoPersona(persona: Persona) {
        this.utilityService.loading.set(true);
        return this.http.put<DbResponse>(`${url}/cambiar-estado-persona`, {
            PERSONA: persona,
        });
    }

    agregarComision(comision: any) {
        return this.http.post<DbResponse>(`${url}/nueva-comision`, comision);
    }

    obtenerExtras(personaID: number) {
        return this.http.get<DbResponse>(
            `${url}/horas-extras?ID=${personaID}`,
            {
                params: { personaID },
            }
        );
    }

    obtenerComisiones(personaID: number) {
        return this.http.get<DbResponse>(`${url}/comisiones?ID=${personaID}`, {
            params: { personaID },
        });
    }
}
