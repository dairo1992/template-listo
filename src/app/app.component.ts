import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TalentoHumanoService } from './service/Talento-Humano/talentohumano.service';
import { UtilityService } from './service/utility.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    constructor(
        private primengConfig: PrimeNGConfig,
        private thService: TalentoHumanoService,
        private utilityService: UtilityService
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.thService.obtenerAreas();
        this.thService.obtenerSedes();
        this.utilityService.obtenerDepartamentos();
        this.utilityService.obtenerTiposDocumento();
        this.utilityService.obtenerTiposHorasExtras();
    }
}
