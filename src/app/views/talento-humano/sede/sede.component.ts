import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Sede } from 'src/app/interfaces/sede-interface';
import { PrimeModuleModule } from 'src/app/layout/prime-module/prime-module.module';
import { TalentoHumanoService } from 'src/app/service/Talento-Humano/talentohumano.service';
import { UtilityService } from 'src/app/service/utility.service';

@Component({
    selector: 'app-sede',
    standalone: true,
    imports: [PrimeModuleModule, CommonModule],
    templateUrl: './sede.component.html',
    styles: ``,
})
export default class SedeComponent {
    uitility = inject(UtilityService);
    formSede: FormGroup;

    constructor(
        private messageService: MessageService,
        public utilyService: UtilityService,
        public thService: TalentoHumanoService
    ) {
        this.formSede = new FormGroup({
            NOMBRE: new FormControl('', Validators.required),
            MUNICIPIO: new FormControl('', Validators.required),
            DEPARTAMENTO: new FormControl('', Validators.required),
        });
    }

    obtenerMuni(): void {
        if (this.formSede.value.DEPARTAMENTO != '') {
            this.utilyService.obtenerMunicipio(
                this.formSede.value.DEPARTAMENTO
            );
        }
    }

    guardar(): void {
        this.thService.nuevaSede(this.formSede.value).subscribe((r) => {
            if (r.STATUS != undefined && r.STATUS != null) {
                if (r.STATUS) {
                    this.thService.sedes.update((v) => [...v, r.DATA]);
                }
                this.messageService.add({
                    severity: r.STATUS ? 'success' : 'error',
                    summary: r.STATUS ? 'Success' : 'Error',
                    detail: r.RESP,
                });
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

    cambiarEstado(sede: Sede): void {
        this.thService.cambiarEstado('S', null, null, sede).subscribe(
            (r) => {
                if (r.STATUS != undefined && r.STATUS != null) {
                    if (r.STATUS) {
                        const index = this.thService
                            .sedes()
                            .findIndex((a) => a == sede);
                        this.thService.sedes.update((a) => {
                            a[index].ESTADO = sede.ESTADO == 'A' ? 'I' : 'A';
                            return a;
                        });
                    }
                    this.messageService.add({
                        severity: r.STATUS ? 'success' : 'error',
                        summary: r.STATUS ? 'Success' : 'Error',
                        detail: r.RESP,
                    });
                    this.uitility.loading.set(false);
                }
            },
            (e) => {
                this.uitility.loading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: e,
                });
            },
            () => {
                this.uitility.loading.set(false);
            }
        );
    }
}
