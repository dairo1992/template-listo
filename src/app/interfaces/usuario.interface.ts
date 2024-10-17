export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    documento: string;
    password: string;
    tipo_usuario: string;
    estado: string;
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
