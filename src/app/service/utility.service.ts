import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { url } from 'src/environments/environment';
import { Departamento } from '../interfaces/departamento-interface';
import { Municipio } from '../interfaces/municipio-interface';
import { DbResponse } from '../interfaces/response-interface';
import { TipoDocumento } from '../interfaces/tipoDocumento-interface';
import { Banco } from '../interfaces/banco-interface';

@Injectable({
    providedIn: 'root',
})
export class UtilityService {
    public loading = signal<boolean>(true);
    public departamentos = signal<Departamento[]>([]);
    public municipios = signal<Municipio[]>([]);
    public tiposDocumento = signal<TipoDocumento[]>([]);
    public estadoCivil = signal<any[]>([]);
    public tiposRh = signal<any[]>([]);
    public tiposContratos = signal<any[]>([]);
    public tipoHoraExtra = signal<any[]>([]);
    public bancos = signal<Banco[]>([]);
    constructor(private http: HttpClient) {}

    obtenerDepartamentos(): void {
        this.http
            .get<DbResponse>(`${url}/get-depa`)
            .subscribe((r) => this.departamentos.set(r.DATA));
    }

    obtenerMunicipio(departamento: number): void {
        this.http
            .get<DbResponse>(`${url}/get-muni?DEPARTAMENTO=${departamento}`)
            .subscribe((r) => this.municipios.set(r.DATA));
    }

    obtenerTiposDocumento(): void {
        this.http
            .get<DbResponse>(`${url}/get-tipodoc`)
            .subscribe((r) => this.tiposDocumento.set(r.DATA));
    }

    obtenerEstadosCiviles(): void {
        this.http
            .get<any>('./assets/JSON/estadoCivil.json')
            .subscribe((r) => this.estadoCivil.set(r));
    }

    obtenerTiposRH(): void {
        this.http
            .get<any>('./assets/JSON/tiposRh.json')
            .subscribe((r) => this.tiposRh.set(r));
    }

    obtenerTiposContratos(): void {
        this.http
            .get<any>('./assets/JSON/tiposContratos.json')
            .subscribe((r) => this.tiposContratos.set(r));
    }

    obtenerBancos(): void {
        this.http
            .get<DbResponse>(`${url}/get-bancos`)
            .subscribe((r) => this.bancos.set(r.DATA));
    }

    obtenerSalario() {
        return this.http.get<DbResponse>(`${url}/salario-minimo`);
    }

    obtenerTiposHorasExtras() {
        this.http
            .get<any>('./assets/JSON/tipoHoraExtra.json')
            .subscribe((r) => {
                this.tipoHoraExtra.set(r);
            });
    }
}
