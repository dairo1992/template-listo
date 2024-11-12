import { Modulo } from './modulo.interface';
import { Usuario } from './usuario.interface';

export interface ConfigUser {
    id: number;
    modulo_id: number;
    usuario_id: number;
    turnos_prioritarios: number;
    modulo: Modulo;
    usuario: Usuario;
}
