import { Cliente } from './cliente.interface';
import { Modulo } from './modulo.interface';
import { Servicio } from './servicio.interface';
import { Usuario } from './usuario.interface';

export interface TurnoGenerado {
    id: number;
    estado: string;
    modulo: Modulo;
    servicio: Servicio;
    prioridad: number;
    cliente: Cliente;
    numero_turno: number;
    hora_atencion: null;
    hora_creacion: string;
    fecha_atencion: null;
    fecha_creacion: Date;
    turno_formateado: string;
    usuario_atencion: Usuario;
    usuario_registro: Usuario;
    hora_finalizacion: null;
    fecha_finalizacion: null;
}
