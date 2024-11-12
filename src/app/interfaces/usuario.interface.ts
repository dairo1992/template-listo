import { Empresa } from './empresa.interface';
import { Modulo } from './modulo.interface';
import { Servicio } from './servicio.interface';

export interface Usuario {
    id: number;
    estado: string;
    modulo: Modulo;
    nombre: string;
    empresa: Empresa;
    apellido: string;
    password: string;
    servicio: Servicio;
    documento: string;
    prioritario: number;
    tipo_usuario: string;
    token: string;
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
