import { Cliente } from "./cliente.interface";
import { Servicio } from "./servicio.interface";

export interface TurnosActivos {
    estado:           string;
    cliente:          Cliente;
    servicio:         Servicio;
    turno_id:         number;
    prioridad:        number;
    numero_turno:     number;
    hora_creacion:    string;
    fecha_creacion:   Date;
    nombre_servicio:  string;
    turno_formateado: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toTurnosActivos(json: string): TurnosActivos[] {
        return JSON.parse(json);
    }

    public static turnosActivosToJson(value: TurnosActivos[]): string {
        return JSON.stringify(value);
    }
}
