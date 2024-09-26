import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Persona } from 'src/app/interfaces/persona-interface';
import { PrimeModuleModule } from 'src/app/layout/prime-module/prime-module.module';
import { TalentoHumanoService } from 'src/app/service/Talento-Humano/talentohumano.service';
import { UtilityService } from 'src/app/service/utility.service';

@Component({
    selector: 'app-funcionario',
    standalone: true,
    imports: [PrimeModuleModule, CommonModule],
    templateUrl: './funcionario.component.html',
    styles: ``,
})
export default class FuncionarioComponent {
    uitility = inject(UtilityService);
    modalPersona: boolean;
    modalHorasEstras: boolean;
    persona?: Persona;
    tituloModal: String;
    formPersona: FormGroup;
    // formComision: FormGroup;
    formComision: any;
    minDate: Date = new Date();
    arrayNomina = [];

    constructor(
        private messageService: MessageService,
        public thService: TalentoHumanoService
    ) {
        this.uitility.obtenerEstadosCiviles();
        this.uitility.obtenerTiposRH();
        this.uitility.obtenerTiposContratos();
        this.uitility.obtenerBancos();
        this.thService.obtenerPersonas();
        this.formPersona = new FormGroup({
            TIPO_DOCUMENTO: new FormControl('', Validators.required),
            DOCUMENTO: new FormControl('', [
                Validators.required,
                Validators.min(0),
            ]),
            NOMBRES: new FormControl('', Validators.required),
            APELLIDOS: new FormControl('', Validators.required),
            FECHA_NACIMIENTO: new FormControl('', Validators.required),
            SEXO: new FormControl('', Validators.required),
            RH: new FormControl('', Validators.required),
            ESTADO_CIVIL: new FormControl('', Validators.required),
            TELEFONO: new FormControl('', Validators.required),
            DEPARTAMENTO: new FormControl('', Validators.required),
            MUNICIPIO: new FormControl('', Validators.required),
            DIRECCION: new FormControl('', Validators.required),
            BARRIO: new FormControl(''),
            EMAIL: new FormControl('', Validators.required),
            SEDE: new FormControl('', Validators.required),
            TIPO_CONTRATO: new FormControl('', Validators.required),
            EMPLEADOR: new FormControl('', Validators.required),
            AREA: new FormControl('', Validators.required),
            CARGO: new FormControl('', Validators.required),
            SALARIO: new FormControl('', [
                Validators.required,
                Validators.min(0),
            ]),
            FECHA_INGRESO: new FormControl('', Validators.required),
            FECHA_EGRESO: new FormControl('', Validators.required),
            BANCO: new FormControl('', Validators.required),
            TIPO_CUENTA: new FormControl('', Validators.required),
            CUENTA: new FormControl('', Validators.required),
            JEFE: new FormControl(''),
        });
        // this.formComision = new FormGroup({
        //     PERSONA: new FormControl('', Validators.required),
        //     HORAS_EXTRAS: new FormControl(''),
        //     TIPO_HORAS_EXTRAS: new FormControl(''),
        //     PERIODO_FACTURA: new FormControl(''),
        //     COMISION: new FormControl(''),
        //     OBSERVACION: new FormControl(''),
        // });
        this.formComision = {
            PERSONA: '',
            HORAS_EXTRAS: '',
            TIPO_HORAS_EXTRAS: '',
            PERIODO_FACTURA: '',
            COMISION: '',
            OBSERVACION: '',
            TIPO_COMISION: '',
        };
    }

    showModal(titulo: String): void {
        this.modalPersona = true;
        this.tituloModal = titulo;
    }

    nuevaPersona() {
        this.uitility.loading.set(true);
        if (this.formPersona.value.JEFE == '') {
            this.formPersona.value.JEFE = 0;
        }
        this.thService.nuevaPersona(this.formPersona.value).subscribe((r) => {
            if (r.STATUS != undefined && r.STATUS != null) {
                if (r.STATUS) {
                    this.thService.personas.update((v) => [
                        ...v,
                        r.DATA.PERSONA,
                    ]);
                    this.modalPersona = false;
                    this.messageService.add({
                        severity: r.STATUS ? 'success' : 'error',
                        summary: r.STATUS ? 'Success' : 'Error',
                        detail: r.RESP,
                    });
                } else {
                    for (const e of this.toastError(r.DATA)) {
                        this.messageService.add({
                            severity: r.STATUS ? 'success' : 'error',
                            summary: r.STATUS ? 'Success' : 'Error',
                            detail: e,
                        });
                    }
                }
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: r.toString(),
                });
            }
            this.uitility.loading.set(false);
        });
    }

    obtenerMuni(): void {
        if (this.formPersona.value.DEPARTAMENTO != '') {
            this.uitility.obtenerMunicipio(this.formPersona.value.DEPARTAMENTO);
        }
    }

    obtenerCargos(): void {
        if (this.formPersona.value.AREA != '') {
            this.thService.obtenerCargos(this.formPersona.value.AREA);
        }
    }

    editarUsuario(persona: Persona) {
        this.thService.obtenerCargos(persona.AREA_CODIGO);
        this.uitility.obtenerMunicipio(persona.DEPARTAMENTO_CODIGO);
        this.thService.obtenerCargos(persona.AREA_CODIGO);
        setTimeout(() => {
            this.showModal('EDITAR PERSONA');
            this.formPersona.setValue({
                TIPO_DOCUMENTO: persona.TIPO_DOCUMENTO,
                DOCUMENTO: persona.DOCUMENTO,
                NOMBRES: persona.NOMBRES,
                APELLIDOS: persona.APELLIDOS,
                FECHA_NACIMIENTO: this.addDays(
                    new Date(persona.FECHA_NACIMIENTO),
                    1
                ),
                SEXO: persona.SEXO,
                RH: persona.RH,
                ESTADO_CIVIL: persona.ESTADO_CIVIL,
                TELEFONO: persona.TELEFONO,
                DEPARTAMENTO: parseInt(`${persona.DEPARTAMENTO_CODIGO}`),
                MUNICIPIO: parseInt(`${persona.MUNICIPIO_CODIGO}`),
                DIRECCION: persona.DIRECCION,
                BARRIO: persona.BARRIO,
                EMAIL: persona.EMAIL,
                SEDE: parseInt(`${persona.SEDE_CODIGO}`),
                TIPO_CONTRATO: persona.TIPO_CONTRATO_CODIGO,
                EMPLEADOR: persona.EMPLEADOR,
                AREA: parseInt(`${persona.AREA_CODIGO}`),
                CARGO: parseInt(`${persona.CARGO_CODIGO}`),
                SALARIO: persona.SALARIO,
                FECHA_INGRESO: this.addDays(new Date(persona.FECHA_EGRESO), 1),
                FECHA_EGRESO: this.addDays(new Date(persona.FECHA_EGRESO), 1),
                BANCO: parseInt(`${persona.BANCO_CODIGO}`),
                TIPO_CUENTA: persona.TIPO_CUENTA,
                CUENTA: persona.CUENTA,
                JEFE: parseInt(`${persona.JEFE_CODIGO}`),
            });
        }, 500);
    }

    addDays(date: Date, days: number): Date {
        date.setDate(date.getDate() + days);
        return date;
    }

    cambiarEstadoPersona(persona: Persona) {
        this.thService.cambiarEstadoPersona(persona).subscribe((r) => {
            if (r.STATUS != undefined && r.STATUS != null) {
                if (r.STATUS) {
                    const index = this.thService
                        .personas()
                        .findIndex((a) => a == persona);
                    this.thService.personas.update((a) => {
                        a[index].ESTADO = persona.ESTADO == 'A' ? 'I' : 'A';
                        return a;
                    });
                }
                this.messageService.add({
                    severity: r.STATUS ? 'success' : 'error',
                    summary: r.STATUS ? 'Success' : 'Error',
                    detail: r.RESP,
                });
            }
            this.uitility.loading.set(false);
        });
    }

    addComision(persona: Persona): void {
        this.persona = persona;
        this.modalHorasEstras = true;
        this.tituloModal = 'AÑADIR COMISION U HORAS EXTRAS';
    }

    nuevaComision(): void {
        this.formComision.PERSONA = this.persona.ID;
        this.uitility.loading.set(true);
        this.thService.agregarComision(this.formComision).subscribe((r) => {
            if (r.STATUS != undefined && r.STATUS != null) {
                if (r.RESP == '') {
                    for (const e of this.toastError(r.DATA)) {
                        this.messageService.add({
                            severity: r.STATUS ? 'success' : 'error',
                            summary: r.STATUS ? 'Success' : 'Error',
                            detail: e,
                        });
                    }
                } else {
                    this.formComision = {
                        PERSONA: '',
                        HORAS_EXTRAS: '',
                        TIPO_HORAS_EXTRAS: '',
                        PERIODO_FACTURA: '',
                        COMISION: '',
                        OBSERVACION: '',
                        TIPO_COMISION: '',
                    };
                    this.messageService.add({
                        severity: r.STATUS ? 'success' : 'error',
                        summary: r.STATUS ? 'Success' : 'Error',
                        detail: r.RESP,
                    });
                }
                this.modalHorasEstras = false;
            }
            this.uitility.loading.set(false);
        });
    }

    toastError(data: any): string[] {
        const errors = [];
        const errores = {};
        for (const campo in data) {
            if (data[campo].length > 0) {
                errores[campo] = data[campo];
            }
        }
        Object.keys(errores).map((campo) => errors.push(errores[campo]));
        return errors;
    }

    liquidarNomina(): void {
        this.arrayNomina = [];
        for (let t of this.thService.personas()) {
            this.thService.obtenerComisiones(t.ID).subscribe((c) => {
                let vh: number = this.calcularValorHora(
                    parseInt(t.SALARIO),
                    15
                );
                let sub_trans =
                    parseInt(t.SALARIO) <= parseInt(c.DATA.SALARIO_BASE)
                        ? c.DATA.SUB_TRANSPORTE
                        : 0;
                let total_comisiones = Math.floor(
                    this.calcularExtras(vh, c.DATA)
                );
                let ibc = Math.floor(parseInt(t.SALARIO) + total_comisiones);
                let aporte_salud = this.calcularSalud(ibc);
                let aporte_pension = this.calcularPension(ibc);
                let aporte_fsp = this.calcularFondoSolidaridadPensional(
                    ibc,
                    c.DATA.SALARIO_BASE
                );
                let json = {
                    trabajador: t.DOCUMENTO,
                    salario_base: t.SALARIO,
                    sub_transporte: sub_trans,
                    comisiones: total_comisiones,
                    aporte_salud: Math.floor(aporte_salud),
                    aporte_pension: Math.floor(aporte_pension),
                    aporte_fsp: aporte_fsp,
                };
                this.arrayNomina.push(json);
            });
        }
    }

    calcularValorHora(salario: number, rango_pago: number): number {
        // horasSemanales = 46;
        if (rango_pago == 15) {
            return salario / 2 / (46 * 2);
        }
        if (rango_pago == 30) {
            return salario / (46 * 4);
        }
        return 0;
    }

    calcularSalud(ibc: number): number {
        let total_salud = (4 * ibc) / 100;
        return Math.floor(total_salud);
    }

    calcularPension(ibc: number) {
        let total_salud = (4 * ibc) / 100;
        return Math.floor(total_salud);
    }

    calcularFondoSolidaridadPensional(ibc: number, smlv: number): number {
        var aporte = 0;
        let num_smlv = ibc / smlv;
        if (num_smlv >= 4 && num_smlv <= 16) {
            aporte = (1 * smlv) / 100;
        }
        if (num_smlv > 16 && num_smlv <= 17) {
            aporte = (1.2 * smlv) / 100;
        }
        if (num_smlv > 17 && num_smlv <= 18) {
            aporte = (1.4 * smlv) / 100;
        }
        if (num_smlv > 18 && num_smlv <= 19) {
            aporte = (1.6 * smlv) / 100;
        }
        if (num_smlv > 19 && num_smlv <= 20) {
            aporte = (1.8 * smlv) / 100;
        }
        if (num_smlv > 20) {
            aporte = (2 * smlv) / 100;
        }
        return aporte;
    }

    calcularExtras(vh: number, extras: any): number {
        var totalComision: number = 0;
        for (let e in extras) {
            switch (e) {
                case 'HED':
                    totalComision += vh * 0.25 * parseInt(extras.HED ?? 0);
                    break;
                case 'HEN':
                    totalComision += vh * 0.75 * parseInt(extras.HEN ?? 0);
                    break;
                case 'HEDD':
                    totalComision += vh * parseInt(extras.HEDD ?? 0);
                    break;
                case 'HED':
                    totalComision += vh * 1.5 * parseInt(extras.HED ?? 0);
                    break;
                case 'RN':
                    totalComision += vh * 0.35 * parseInt(extras.RN ?? 0);
                    break;
                case 'RND':
                    totalComision += vh * 1.1 * parseInt(extras.RND ?? 0);
                    break;

                default:
                    break;
            }
        }
        return totalComision;
    }

    liquidadorViejo(): void {
        var salario_base = 0;
        var salario_hora = 0.0;
        var sub_transporte = 0;
        this.uitility.obtenerSalario().subscribe((r) => {
            salario_base = r.DATA[0].SALARIO_BASE;
            sub_transporte = r.DATA[0].SUB_TRANSPORTE;
            salario_hora = salario_base / 240;
        });
        for (const e of this.thService.personas()) {
            var comision = 0;
            var horas_extras: any;
            var valor_hExtras = 0;
            this.thService.obtenerExtras(e.ID).subscribe((r) => {
                for (const h of r.DATA) {
                    switch (h.TIPO_HORA_EXTRA) {
                        case 'HED':
                            valor_hExtras +=
                                salario_hora * 0.25 * h.HORAS_EXTRAS;
                            break;
                        case 'HEN':
                            valor_hExtras +=
                                salario_hora * 0.75 * h.HORAS_EXTRAS;
                            break;
                        case 'HEDD':
                            valor_hExtras += salario_hora * h.HORAS_EXTRAS;
                            break;
                        case 'HED':
                            valor_hExtras +=
                                salario_hora * 1.5 * h.HORAS_EXTRAS;
                            break;

                        default:
                            break;
                    }
                }
            });
            this.thService
                .obtenerComisiones(e.ID)
                .toPromise()
                .then((r) => {
                    comision = r.DATA[0].COMISION;
                    console.log(
                        `comision: ${comision} - horas extras: ${valor_hExtras}}`
                    );
                });
            // this.thService.obtenerComisiones(e.ID).subscribe((r) => {
            //     comision = r.DATA[0].COMISION;
            // });
        }
    }

    downloadPdf(): void {
        // const doc = new jsPDF({
        //     orientation: 'p', //set orientation
        //     unit: 'pt', //set unit for document
        //     format: 'letter', //set document standard
        // });
        // const sizes = {
        //     xs: 10,
        //     sm: 14,
        //     p: 16,
        //     h3: 18,
        //     h2: 20,
        //     h1: 22,
        // };
        // const fonts = {
        //     times: 'Times',
        //     helvetica: 'Helvetica',
        // };
        // const margin = 0.5; // inches on a 8.5 x 11 inch sheet.
        // const verticalOffset = margin;
        // const arrayConvertido = this.arrayNomina.map((objeto) => {
        //     const objetoConvertido = {};
        //     for (const propiedad in objeto) {
        //         objetoConvertido[propiedad] = objeto[propiedad].toString();
        //     }
        //     return objetoConvertido;
        // });
        // var columns = [
        //     { title: 'TRABAJADOR', dataKey: 'trabajador' },
        //     { title: 'SALARIO', dataKey: 'salario_base' },
        //     { title: 'SUB TRANSPORTE', dataKey: 'sub_transporte' },
        //     { title: 'COMISIONES', dataKey: 'comisiones' },
        //     { title: 'SALUD', dataKey: 'aporte_salud' },
        //     { title: 'PENSION', dataKey: 'aporte_pension' },
        //     { title: 'FSP', dataKey: 'aporte_fsp' },
        // ];
        // var rows = arrayConvertido;
        // autoTable(doc, {
        //     head: columns,
        //     body: rows,
        // });

        // doc.save();
        // opc 2
        // const arrayConvertido = this.arrayNomina.map((objeto) => {
        //     const objetoConvertido = {};
        //     for (const propiedad in objeto) {
        //         objetoConvertido[propiedad] = objeto[propiedad].toString();
        //     }
        //     return objetoConvertido;
        // });

        // var header = [
        //     'trabajador',
        //     'salario_base',
        //     'sub_transporte',
        //     'comisiones',
        //     'aporte_salud',
        //     'aporte_pension',
        //     'aporte_fsp',
        // ];
        // var data = arrayConvertido;
        // var config = {
        //     autoSize: true,
        //     printHeaders: true,
        // };
        // doc.table(10, 10, data, header, config);
        // doc.output('dataurlnewwindow');
        // doc.save();
    }
}
