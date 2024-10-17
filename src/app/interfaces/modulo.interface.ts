import { Sede } from './sede.interface';

export interface Modulo {
    id: number;
    sede_id: number;
    empresa_id: number;
    nombre: string;
    estado: string;
    created_at: Date;
    sede: Sede;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toModulo(json: string): Modulo {
        return JSON.parse(json);
    }

    public static moduloToJson(value: Modulo): string {
        return JSON.stringify(value);
    }
}
