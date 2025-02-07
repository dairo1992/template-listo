import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertaSwal } from 'src/app/components/swal-alert';
import { Modulo } from 'src/app/interfaces/modulo.interface';
import { Sede } from 'src/app/interfaces/sede.interface';
import { Servicio } from 'src/app/interfaces/servicio.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SedesService } from 'src/app/services/sedes.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { icons } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-servicios',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './servicios.component.html',
    styleUrl: './servicios.component.scss',
})
export default class ServiciosComponent implements OnInit {
    public service = inject(ServiciosService);
    public empresasService = inject(EmpresaService);
    public sedesService = inject(SedesService);
    public getStatus = inject(UtilitiesService).getStatus;
    public usuarioService = inject(UsuarioService);
    servicioForm!: FormGroup;
    modulo: number;
    servicio_id: number;
    showPanel: boolean;
    modalIcon: boolean = false;
    modalNuevoServicio: boolean = false;
    icons = [];
    iconsTemp = [];
    iconSelect: string = '';
    query: string;
    listaSedesFilter: Sede[] = [];
    listaModulosFilter: Modulo[] = [];
    private alert: AlertaSwal = new AlertaSwal();

    constructor() {
        const id_user = this.usuarioService.currentUser().id;
        this.obtenerServicios(id_user);
        this.obtenerSedes(id_user);
        this.showPanel = false;
        this.icons = icons;
        this.iconsTemp = icons;
        this.limpiarForm();
    }

    ngOnInit(): void {
        // if (this.usuarioService.currentUser().tipo_usuario != 'SUPER_ADMIN') {
        //     this.servicioForm.controls['empresa_id'].disable();
        // }
    }

    limpiarForm() {
        this.servicioForm = new FormGroup({
            id: new FormControl(0, Validators.required),
            nombre: new FormControl('', Validators.required),
            color: new FormControl(),
            icono: new FormControl(''),
            estado: new FormControl('A'),
            empresa_id: new FormControl(this.usuarioService.currentUser().empresa.id, Validators.required),
        });
    }


    obtenerSedes(id_user: number) {
        if (this.sedesService.lista_sedes().length > 0) return;
        this.sedesService.obtenerSedes(id_user).subscribe({
            next: (data: any) => {
                this.sedesService._lista_sedes.set(data);
            },
            error: (err) => {
                this.alert.showMessage({
                    position: "center",
                    icon: "error",
                    title: "!NOTIFICACION¡",
                    text: err.error,
                    showConfirmButton: true,
                });
            },
        });
    }

    obtenerServicios(id_user: number): void {
        this.alert.loading();
        this.service.obtenerServicios(id_user).subscribe({
            next: (data) => {
                this.service._lista_servicios.set(data);
                this.alert.close();
            },
            error: (err) => {
                this.alert.showMessage({
                    position: "center",
                    icon: "error",
                    title: "!NOTIFICACION¡",
                    text: err.error,
                    showConfirmButton: true,
                });
            },
        });
    }

    nuevoServicio(): void {
        this.alert.loading();
        this.modalNuevoServicio = false;
        // this.servicioForm.controls['empresa_id'].setValue(this.usuarioService.currentUser().empresa.id);
        // const form = { ...this.servicioForm.value, empresa_id: this.usuarioService.currentUser().empresa.id };
        this.service.nuevoServicio(this.servicioForm.value).subscribe({
            next: (value: any) => {
                
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "!NOTIFICACION¡",
                    text: value,
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.obtenerServicios(this.usuarioService.currentUser().id);
                    }
                });
                this.limpiarForm();
            },
            error: (err) => {
                this.alert.showMessage({
                    position: "center",
                    icon: "error",
                    title: "!NOTIFICACION¡",
                    text: err.error,
                    showConfirmButton: true,
                });
            },
        });

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
        console.log(this.listaSedesFilter);

    }

    setModulo(modulo: Modulo): void {
        this.listaSedesByEmpresa(modulo.sede.empresa_id);
        // this.moduloForm.setValue(modulo);
        // this.modalTitle = `MODIFICAR ${modulo.nombre}`;
        // this.modalNuevaSede = true;
    }

    setServicio(servicio: Servicio): void {
        const servicioTemp = {
            id: servicio.id,
            nombre: servicio.nombre,
            color: servicio.color,
            icono: servicio.icono,
            estado: servicio.estado,
            empresa_id: this.usuarioService.currentUser().empresa.id,
        }
        this.iconSelect = servicio.icono;
        this.servicioForm.setValue(servicioTemp);
        this.modalNuevoServicio = true;
        console.log(this.servicioForm);

    }

    actualizarServicio(servicio: any): void {
        this.alert.loading();
        this.service.actualizarServicio(servicio.id, servicio).subscribe({
            next: (value: Servicio) => {
                const i = this.service.lista_servicios().findIndex(
                    (e) => e.id == servicio.id
                );
                this.service._lista_servicios.update((servicios) => {
                    const sed = this.sedesService.lista_sedes().find((e) => e.id == servicio.sede_id);
                    servicios.splice(i, 1);
                    servicio.modulo.sede = sed;
                    servicios.push(servicio);
                    return servicios;
                });
                this.alert.showMessage({
                    position: "center",
                    icon: "success",
                    title: "!NOTIFICACION¡",
                    text: `ACTUALIZADO CORRECTAMENTE`,
                    showConfirmButton: true,
                });
                this.limpiarForm();
            },
            error: (err) => {
                this.alert.showMessage({
                    position: "center",
                    icon: "error",
                    title: "!NOTIFICACION¡",
                    text: err.error,
                    showConfirmButton: true,
                });
            },
        });
    }

    uiEstado(servicio: Servicio): void {
        this.service.uiEstado(servicio).subscribe({
            next: (value: Servicio) => {
                this.service._lista_servicios.update((servicios) => {
                    servicios.find((e) => e.id == servicio.id).estado =
                        servicio.estado == 'A' ? 'I' : 'A';
                    return servicios;
                });
                this.alert.showMessage({
                    position: "center",
                    icon: "success",
                    title: "!NOTIFICACION¡",
                    text: `ACTUALIZADO CORRECTAMENTE`,
                    showConfirmButton: true,
                });
            },
            error: (err) => {
                this.alert.showMessage({
                    position: "center",
                    icon: "error",
                    title: "!NOTIFICACION¡",
                    text: err.error,
                    showConfirmButton: true,
                });
            },
        });
    }

    selectServicio(servicio: Servicio) {
        this.servicio_id = servicio.id;
    }

    config_modulo_servicio(modulo: number): void {
        this.service.config_modulo_servicio(modulo, this.servicio_id).subscribe({
            next: (value: Servicio) => {
                this.alert.showMessage({
                    position: "center",
                    icon: "success",
                    title: "!NOTIFICACION¡",
                    text: `CONFIGURACION REALIZADA CORRECTAMENTE`,
                    showConfirmButton: true,
                });
                this.showPanel = true;
            },
            error: (err) => {
                this.alert.showMessage({
                    position: "center",
                    icon: "error",
                    title: "!NOTIFICACION¡",
                    text: err.error,
                    showConfirmButton: true,
                });
            },
        });

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
