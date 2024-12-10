import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Modulo } from 'src/app/interfaces/modulo.interface';
import { Sede } from 'src/app/interfaces/sede.interface';
import { Servicio } from 'src/app/interfaces/servicio.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ModuloService } from 'src/app/services/modulo.service';
import { SedesService } from 'src/app/services/sedes.service';
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
    public empresasService = inject(EmpresaService);
    private sedesService = inject(SedesService);
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
    listaSedesFilter: Sede[] = [];
    listaModulosFilter: Modulo[] = [];

    constructor() {
        const id_user = this.usuarioService.currentUser().tipo_usuario == 'SUPER_ADMIN' ? 0 : this.usuarioService.currentUser().id;
        this.service.obtenerServicios(id_user);
        this.moduloService.obtenerModulos(id_user);
        this.empresasService.obtenerEmpresas(id_user);
        this.sedesService.obtenerSedes(id_user);
        this.showPanel = false;
        this.icons = icons;
        this.iconsTemp = icons;
        this.limpiarForm();
        if (this.usuarioService.currentUser().tipo_usuario != 'SUPER_ADMIN') {
            this.servicioForm.controls['empresa_id'].disable();
            this.listaSedesByEmpresa(this.usuarioService.currentUser().empresa.id);
        }
    }

    limpiarForm() {
        this.servicioForm = new FormGroup({
            id: new FormControl(0, Validators.required),
            nombre: new FormControl('', Validators.required),
            modulo: new FormControl(0, Validators.required),
            descripcion: new FormControl(''),
            color: new FormControl(),
            icono: new FormControl(''),
            estado: new FormControl('A'),
            empresa_id: new FormControl(this.usuarioService.currentUser().empresa.id),
            sede_id: new FormControl(0),
        });
    }

    nuevoServicio(): void {
        this.service.nuevoServicio(this.servicioForm.value);
        this.limpiarForm();
    }

    listaSedesByEmpresa(id_empresa: number, accion = 'N') {
        const usuario = this.usuarioService.currentUser();
        this.listaSedesFilter = this.sedesService
            .lista_sedes()
            .filter((sede) => {
                if (accion === 'N' && usuario.tipo_usuario === 'SUPER_ADMIN') {
                    return sede;
                } else {
                    if (sede.empresa_id == id_empresa) {
                        return sede;
                    }
                    return null;
                }
            });
    }

    listaModulosBySede(id_sede: number, accion = 'N') {
        const usuario = this.usuarioService.currentUser();
        this.listaModulosFilter = this.moduloService
            .lista_modulos()
            .filter((modulo) => {
                if (accion === 'N' && usuario.tipo_usuario === 'SUPER_ADMIN') {
                    return modulo;
                } else {
                    if (modulo.sede_id == id_sede) {
                        return modulo;
                    }
                    return null;
                }
            });
    }

    setServicio(servicio: Servicio): void {
        this.listaSedesByEmpresa(servicio.modulo.sede.empresa_id, 'E');
        this.listaModulosBySede(servicio.modulo.id, 'E');
        const servicioTemp = {
            id: servicio.id,
            nombre: servicio.nombre,
            modulo: servicio.modulo.id,
            descripcion: servicio.descripcion,
            color: servicio.color,
            icono: servicio.icono,
            estado: servicio.estado,
            empresa_id: servicio.modulo.sede.empresa_id,
            sede_id: servicio.modulo.sede_id
        }
        this.servicioForm.setValue(servicioTemp);
    }

    actualizarServicio(servicio: Servicio): void {
        this.service.actualizarServicio(servicio.id, servicio);
        this.limpiarForm();
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
