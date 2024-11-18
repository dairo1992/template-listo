import { Empresa } from "./empresa.interface";

export interface Sede {
    id:         number;
    estado:     string;
    nombre:     string;
    empresa:    Empresa;
    direccion:  string;
    created_at: Date;
    empresa_id: number;
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
