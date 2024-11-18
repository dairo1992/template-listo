import { Sede } from './sede.interface';

export interface Modulo {
    id: number;
    sede: Sede;
    estado: string;
    nombre: string;
    sede_id: number;
    created_at: Date;
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
