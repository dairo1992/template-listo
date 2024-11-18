import { Empresa } from './empresa.interface';
import { Modulo } from './modulo.interface';
import { Servicio } from './servicio.interface';

export interface Usuario {
    id: number;
    config: Config;
    estado: string;
    modulo: Modulo;
    nombre: string;
    empresa: Empresa;
    apellido: string;
    password: string;
    servicio: Servicio[];
    documento: string;
    tipo_usuario: string;
    prioritario: number;
    token: string;
}

export interface Config {
    id: number;
    modulo_id: number;
    prioritarios: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toUsuario(json: string): Usuario {
        return JSON.parse(json);
    }

    public static usuarioToJson(value: Usuario): string {
        return JSON.stringify(value);
    }
}
