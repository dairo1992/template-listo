import { UtilityService } from 'src/app/service/utility.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Area } from 'src/app/interfaces/area-interface';
import { PrimeModuleModule } from 'src/app/layout/prime-module/prime-module.module';
import { TalentoHumanoService } from 'src/app/service/Talento-Humano/talentohumano.service';

@Component({
    selector: 'app-area',
    standalone: true,
    imports: [PrimeModuleModule, CommonModule],
    templateUrl: './area.component.html',
    styles: ``,
})
export default class AreaComponent {
    uitility = inject(UtilityService);
    formArea: FormGroup;

    constructor(
        public thumanoService: TalentoHumanoService,
        private messageService: MessageService
    ) {
        this.formArea = new FormGroup({
            NOMBRE: new FormControl('', Validators.required),
        });
    }

    guardar(): void {
        this.thumanoService.nuevaArea(this.formArea.value);
        this.formArea.reset();
        // .subscribe(
        //     (r) => {
        //         if (r.STATUS != undefined && r.STATUS != null) {
        //             if (r.STATUS) {
        //                 this.thumanoService.areas.update((v) => [...v, r.DATA]);
        //                 this.formArea.reset();
        //             }
        //             this.messageService.add({
        //                 severity: r.STATUS ? 'success' : 'error',
        //                 summary: r.STATUS ? 'Success' : 'Error',
        //                 detail: r.RESP,
        //             });
        //         } else {
        //             this.messageService.add({
        //                 severity: 'error',
        //                 summary: 'Error',
        //                 detail: r.toString(),
        //             });
        //         }
        //     },
        //     (error) => {
        //         this.loading = false;
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: 'Error',
        //             detail: error.error.RESP.data.token,
        //         });
        //     },
        //     () => {
        //         console.log('peticion completada');
        //         this.loading = false;
        //     }
        // );
    }

    cambiarEstado(area: Area): void {
        this.thumanoService.cambiarEstado('A', area, null).subscribe(
            (r) => {
                if (r.STATUS != undefined && r.STATUS != null) {
                    if (r.STATUS) {
                        const index = this.thumanoService
                            .areas()
                            .findIndex((a) => a == area);
                        this.thumanoService.areas.update((a) => {
                            a[index].ESTADO = area.ESTADO == 'A' ? 'I' : 'A';
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
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: e,
                });
            },
            () => {}
        );
    }
}
