import { Sede } from './sede.interface';

export interface Empresa {
    id: number;
    nit: string;
    sede: Sede;
    nombre: string;
    direccion: string;
    estado: string;
    created_at: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toEmpresa(json: string): Empresa {
        return JSON.parse(json);
    }

    public static empresaToJson(value: Empresa): string {
        return JSON.stringify(value);
    }
}
