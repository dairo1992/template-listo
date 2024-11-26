export interface Cliente {
    id: number;
    tipo_documento: string;
    documento: number;
    nombre: string;
    apellido: string;
    telefono: number;
    email: string;
    fecha_nacimiento: string;
    observaciones: string;
    empresa_id: string;
}

export class Convert {
    public static toUsuario(json: string): Cliente {
        return JSON.parse(json);
    }

    public static usuarioToJson(value: Cliente): string {
        return JSON.stringify(value);
    }
}
