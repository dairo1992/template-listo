export interface TurnosByUsuario {
    ACTIVOS: number;
    ATENDIDOS: number;
    TOTAL: number;
    TURNOS: Servicios[];
}

interface Servicios {
    nombre: string,
    total: number,
    activos: number,
    atendidos: number
}