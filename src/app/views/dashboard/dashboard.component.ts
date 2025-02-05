import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { ReportesService } from 'src/app/services/reportes.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './dashboard.component.html',
    styles: ``,
})
export default class DashboardComponent implements OnInit {
    private reportesService = inject(ReportesService);
    private usuariosService = inject(UsuarioService);
    formReporte!: FormGroup;
    dataBarras: any;
    dataDonuts: any;
    dataBarraUsuario: any;
    optionsBarras: any;
    optionsDonuts: any;
    optionsBarraUsuario: any;

    constructor() {
        this.limpiarForm();
    }

    limpiarForm() {
        this.formReporte = new FormGroup({
            empresa_id: new FormControl(this.usuariosService.currentUser().empresa.id, Validators.required),
            fecha_inicio: new FormControl(),
            fecha_fin: new FormControl(),
        });
    }

    ngOnInit(): void {
        this.obtenerReporte({
            empresa_id: this.usuariosService.currentUser().empresa.id,
            fecha_inicio: null,
            fecha_fin: null,
        })
    }

    obtenerReporte(form: any = null) {
        this.reportesService.obtenerReportes(form == null ? this.formReporte.value : form).subscribe({
            next: (data: any) => {
                const labelsBarra = data.barras.map((item: any) => item.mes);
                const dataAtendidosBarra = data.barras.map((item: any) => item.atendidos);
                const dataPerdidos = data.barras.map((item: any) => item.perdidos);
                this.initBarras(labelsBarra, dataAtendidosBarra, dataPerdidos);
                this.initDonuts(data.donuts.labels, data.donuts.datasets);
                this.initBarrasUsuarios(data.empleados.labels, data.empleados.datasets);
            },
        });
    }

    initDonuts(labels: any, dataset: any) {
        this.dataDonuts = {
            labels: labels,
            datasets: dataset
        };
        this.optionsDonuts = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: '#36A2EB'
                    }
                }
            }
        };
    }

    initBarras(labels: any, atendidos: any, perdidos: any) {
        this.dataBarras = {
            labels: labels,
            datasets: [
                {
                    label: 'ATENDIDOS',
                    backgroundColor: '#36A2EB',
                    borderColor: '#36A2EB',
                    data: atendidos
                },
                {
                    label: 'ANULADOS',
                    backgroundColor: '#00ffbf',
                    borderColor: '#00ffbf',
                    data: perdidos
                }
            ]
        };
        this.optionsBarras = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: "#f97316"
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        drawBorder: false
                    }
                },
                y: {
                    grid: {
                        drawBorder: false
                    }
                }
            }
        };
    }

    initBarrasUsuarios(labels: any, datasets: any) {
        this.dataBarraUsuario = {
            labels: labels,
            datasets: datasets,
        };

        this.optionsBarraUsuario = {
            maintainAspectRatio: false,
            aspectRatio: 1.1,
        };
    }

    descargarReporte(form: any = null) {
        this.reportesService.descargarReporte(form == null ? this.formReporte.value : form).subscribe({
            next: (data: any) => {
                console.log(data);

            },
        });
    }
}
