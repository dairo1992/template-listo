import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Servicio } from 'src/app/interfaces/servicio.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { ModuloService } from 'src/app/services/modulo.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
    selector: 'app-servicios',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './servicios.component.html',
    styleUrl: './servicios.component.scss',
})
export default class ServiciosComponent {
    public service = inject(ServiciosService);
    public moduloService = inject(ModuloService);
    public getStatus = inject(UtilitiesService).getStatus;
    servicioForm!: FormGroup;
    modulo: number;
    servicio_id: number;
    showPanel: boolean;

    constructor() {
        this.showPanel = false;
        this.servicioForm = new FormGroup({
            id: new FormControl(0, Validators.required),
            nombre: new FormControl('', Validators.required),
            descripcion: new FormControl(''),
            estado: new FormControl('A'),
        });
    }

    nuevoServicio(): void {
        this.service.nuevoServicio(this.servicioForm.value);
        this.servicioForm.reset({
            id: 0,
            nombre: '',
            descripcion: '',
            estado: 'A',
        });
    }

    setServicio(servicio: Servicio): void {
        // empresa.horario_atencion = new Date(empresa.horario_atencion);
        this.servicioForm.setValue(servicio);
    }

    actualizarServicio(servicio: Servicio): void {
        this.service.actualizarServicio(servicio.id, servicio);
    }

    uiEstado(servicio: Servicio): void {
        this.service.uiEstado(servicio);
    }

    selectServicio(servicio: Servicio) {
        this.servicio_id = servicio.id;
    }

    config_modulo_servicio(modulo: number): void {
        this.service.config_modulo_servicio(modulo, this.servicio_id);
        this.showPanel = true;
    }
}
