import { Usuario } from './usuario.interface';

export interface Auth {
    access_token: string;
    usuario: Usuario;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toAuth(json: string): Auth {
        return JSON.parse(json);
    }

    public static authToJson(value: Auth): string {
        return JSON.stringify(value);
    }
}
