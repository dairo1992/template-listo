export interface Modulo {
    id: number;
    estado: string;
    nombre: string;
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
