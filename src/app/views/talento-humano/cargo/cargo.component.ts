import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Area } from 'src/app/interfaces/area-interface';
import { Cargo } from 'src/app/interfaces/cargo-interface';
import { PrimeModuleModule } from 'src/app/layout/prime-module/prime-module.module';
import { TalentoHumanoService } from 'src/app/service/Talento-Humano/talentohumano.service';

@Component({
    selector: 'app-cargo',
    standalone: true,
    imports: [PrimeModuleModule, CommonModule],
    templateUrl: './cargo.component.html',
    styles: ``,
})
export default class CargoComponent {
    loading: boolean = false;
    formCargo: FormGroup;

    constructor(
        public tHumanoService: TalentoHumanoService,
        private messageService: MessageService
    ) {
        this.formCargo = new FormGroup({
            NOMBRE: new FormControl('', Validators.required),
            AREA: new FormControl('', Validators.required),
        });
    }

    guardar(): void {
        this.loading = true;
        this.tHumanoService.nuevaCargo(this.formCargo.value).subscribe(
            (r) => {
                if (r.STATUS != undefined && r.STATUS != null) {
                    if (r.STATUS) {
                        // this.areas.push(r.DATA);
                        this.tHumanoService.cargos.update((value) => [
                            ...value,
                            r.DATA,
                        ]);

                        // this.count.update( value => value +1)
                        this.formCargo.reset();
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
            },
            (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.RESP.data.token,
                });
            },
            () => {
                console.log('peticion completada');
                this.loading = false;
            }
        );
    }

    cambiarEstado(cargo: Cargo): void {
        this.loading = true;
        this.tHumanoService.cambiarEstado('C', null, cargo).subscribe(
            (r) => {
                if (r.STATUS != undefined && r.STATUS != null) {
                    if (r.STATUS) {
                        const index = this.tHumanoService
                            .cargos()
                            .findIndex((a) => a == cargo);
                        this.tHumanoService.cargos.update((a) => {
                            a[index].ESTADO = cargo.ESTADO == 'A' ? 'I' : 'A';
                            return a;
                        });
                    }
                    this.messageService.add({
                        severity: r.STATUS ? 'success' : 'error',
                        summary: r.STATUS ? 'Success' : 'Error',
                        detail: r.RESP,
                    });
                }
            },
            (e) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: e,
                });
            },
            () => {
                this.loading = false;
            }
        );
    }
}
