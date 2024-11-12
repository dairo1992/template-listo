import { Component, inject } from '@angular/core';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { ConfigUsuariosService } from 'src/app/services/services/config-usuarios.service';

@Component({
    selector: 'app-config-usuarios',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './config-usuarios.component.html',
    styleUrl: './config-usuarios.component.scss',
})
export default class ConfigUsuariosComponent {
    public service = inject(ConfigUsuariosService);
}
