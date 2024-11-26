import { Modulo } from './modulo.interface';

export interface Servicio {
    id: number;
    icon: string;
    color: string;
    estado: string;
    modulo: Modulo;
    nombre: string;
    descripcion: string;
}

export class Convert {
    public static toServicio(json: string): Servicio {
        return JSON.parse(json);
    }

    public static servicioToJson(value: Servicio): string {
        return JSON.stringify(value);
    }
}
