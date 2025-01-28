import { Modulo } from './modulo.interface';
import { Sede } from './sede.interface';

export interface Servicio {
    id: number;
    icono: string;
    color: string;
    estado: string;
    nombre: string;
    sede: Sede | null;
}

export class Convert {
    public static toServicio(json: string): Servicio {
        return JSON.parse(json);
    }

    public static servicioToJson(value: Servicio): string {
        return JSON.stringify(value);
    }
}
