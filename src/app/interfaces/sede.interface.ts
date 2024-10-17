import { Empresa } from './empresa.interface';

export interface Sede {
    id: number;
    empresa_id: number;
    nombre: string;
    direccion: string;
    estado: string;
    created_at: Date;
    empresa: Empresa;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toSede(json: string): Sede {
        return JSON.parse(json);
    }

    public static sedeToJson(value: Sede): string {
        return JSON.stringify(value);
    }
}
