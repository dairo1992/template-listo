import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    constructor(private primengConfig: PrimeNGConfig) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
        // this.thService.obtenerAreas();
        // this.thService.obtenerSedes();
        // this.utilityService.obtenerDepartamentos();
        // this.utilityService.obtenerTiposDocumento();
        // this.utilityService.obtenerTiposHorasExtras();
    }
}
