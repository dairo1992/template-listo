export interface Comision {
    ID?: number;
    PERSONA_CODIGO: number;
    PERSONA_NOMBRE: string;
    HORAS_EXTRAS: number;
    COMISION: number;
    PERIODO_FACTURADO: string;
    ESTADO: string;
    FECHA_CREACION: Date;
    FECHA_ACTUALIZACION: Date;
    RESPONSABLE_CODIGO: number;
    RESPONSABLE_NOMBRE: string;
}
