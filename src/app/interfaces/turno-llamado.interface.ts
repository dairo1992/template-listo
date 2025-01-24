export interface TurnoLlamado {
    MSG: string;
    DATA: Data;
    STATUS: boolean;
}

export interface Data {
    turno: string;
    nombre: string;
    servicio: string;
    turno_id: number;
    servicio_id: number;
    documento: string;
    tipo_documento: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toTurnoLlamado(json: string): TurnoLlamado {
        return JSON.parse(json);
    }

    public static turnoLlamadoToJson(value: TurnoLlamado): string {
        return JSON.stringify(value);
    }
}
