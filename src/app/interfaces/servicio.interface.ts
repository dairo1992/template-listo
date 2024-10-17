export interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;
}

export class Convert {
    public static toServicio(json: string): Servicio {
        return JSON.parse(json);
    }

    public static servicioToJson(value: Servicio): string {
        return JSON.stringify(value);
    }
}
