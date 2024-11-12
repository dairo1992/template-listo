// To parse this data:
//
//   import { Convert, Sede } from "./file";
//
//   const sede = Convert.toSede(json);

export interface Sede {
    id:        number;
    estado:    string;
    nombre:    string;
    direccion: string;
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
