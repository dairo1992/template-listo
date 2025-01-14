import { Component, inject, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AlmacenService } from './services/storage.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    private storageService = inject(AlmacenService);
    constructor(private primengConfig: PrimeNGConfig, private router: Router) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
