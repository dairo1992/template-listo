import { Component, inject } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { UsuarioService } from 'src/app/services/usuario.service';
import GenerarComponent from '../generar/generar.component';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
    selector: 'app-gestionar',
    standalone: true,
    imports: [PrimeModule, GenerarComponent],
    templateUrl: './gestionar.component.html',
    styleUrl: './gestionar.component.scss',
})
export default class GestionarComponent {
    modalGenerarTurno: boolean = false;
    modalListaTurno: boolean = false;
    public currentUser: Usuario = inject(UsuarioService).currentUser();
    public turnosService = inject(TurnosService);

    consultarTurnos() {
        this.modalListaTurno = true;
        this.turnosService.obtenerTurnos(this.currentUser.id);
    }
}
