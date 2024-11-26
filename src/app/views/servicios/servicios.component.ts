import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Servicio } from 'src/app/interfaces/servicio.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { ModuloService } from 'src/app/services/modulo.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { icons } from 'src/environments/environment';

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
    public usuarioService = inject(UsuarioService);
    servicioForm!: FormGroup;
    modulo: number;
    servicio_id: number;
    showPanel: boolean;
    modalIcon: boolean = false;
    icons = [];
    iconsTemp = [];
    iconSelect: string = '';
    query: string;

    constructor() {
        this.service.obtenerServicios(this.usuarioService.currentUser().id);
        this.moduloService.obtenerModulos(this.usuarioService.currentUser().id);
        this.showPanel = false;
        this.icons = icons;
        this.iconsTemp = icons;
        this.servicioForm = new FormGroup({
            id: new FormControl(0, Validators.required),
            nombre: new FormControl('', Validators.required),
            modulo: new FormControl(0, Validators.required),
            descripcion: new FormControl(''),
            color_servicio: new FormControl(),
            icono: new FormControl(''),
            estado: new FormControl('A'),
        });
    }

    nuevoServicio(): void {
        // this.service.nuevoServicio(this.servicioForm.value);
        // this.servicioForm.reset({
        //     id: 0,
        //     nombre: '',
        //     modulo: 0,
        //     descripcion: '',
        //     color: '',
        //     estado: 'A',
        // });
        console.log(this.servicioForm.value);
        
    }

    setServicio(servicio: Servicio): void {
        // empresa.horario_atencion = new Date(empresa.horario_atencion);
        this.servicioForm.setValue(servicio);
    }

    actualizarServicio(servicio: Servicio): void {
        this.service.actualizarServicio(servicio.id, servicio);
        this.servicioForm.reset({
            id: 0,
            nombre: '',
            modulo: 0,
            descripcion: '',
            color: '',
            estado: 'A',
        });
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

    SelectIcon(icon: string) {
        this.servicioForm.controls['icono'].setValue(icon);
        this.iconSelect = icon;
        this.modalIcon = false;
    }
    filterIcon(query: string) {
        if (query == '') {
            this.iconsTemp = this.icons;
        } else {
            this.iconsTemp = this.icons.filter((i) => i.includes(query));
        }
    }
}
