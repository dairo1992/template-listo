import { Component } from '@angular/core';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './dashboard.component.html',
    styles: ``,
})
export default class DashboardComponent { }
