export interface Persona {
    ID?: number;
    TIPO_DOCUMENTO: string;
    DOCUMENTO: string;
    NOMBRES: string;
    APELLIDOS: string;
    FECHA_NACIMIENTO: string;
    SEXO: string;
    RH: string;
    ESTADO_CIVIL: string;
    TELEFONO: string;
    MUNICIPIO_CODIGO: number;
    MUNICIPIO_NOMBRE: string;
    DEPARTAMENTO_CODIGO: number;
    DIRECCION: string;
    BARRIO: string;
    EMAIL: string;
    SEDE_CODIGO: number;
    SEDE_NOMBRE: string;
    TIPO_CONTRATO_NOMBRE: string;
    TIPO_CONTRATO_CODIGO: string;
    EMPLEADOR: string;
    AREA_NOMBRE: string;
    AREA_CODIGO: number;
    CARGO_NOMBRE: string;
    CARGO_CODIGO: number;
    SALARIO: string;
    FECHA_INGRESO: string;
    FECHA_EGRESO: string;
    TIPO_CUENTA: string;
    CUENTA: string;
    BANCO_NOMBRE: string;
    BANCO_CODIGO: number;
    JEFE_NOMBRE: string;
    JEFE_CODIGO: number;
    ESTADO: string;
    FECHA_CREACION: string;
    FECHA_ACTUALIZACION: string;
    RESPONSABLE_NOMBRE: string;
    RESPONSABLE_CODIGO: number;
}
