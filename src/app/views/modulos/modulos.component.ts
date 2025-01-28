import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertaSwal } from 'src/app/components/swal-alert';
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
import Swal from 'sweetalert2';
@Component({
    selector: 'app-modulos',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './modulos.component.html',
    styleUrl: './modulos.component.scss',
})
export default class ModulosComponent {
    public service = inject(ModuloService);
    public _sedes_Service = inject(SedesService);
    public empresaService = inject(EmpresaService);
    public usuarioService = inject(UsuarioService);
    public sedesService = inject(SedesService);
    public serviciosService = inject(ServiciosService);
    serviciosDisponibles: Servicio[] = [];
    serviciosSeleccionados: Servicio[] = [];
    moduloSeleccionado: Modulo;
    public getStatus = inject(UtilitiesService).getStatus;
    modalNuevaSede: boolean = false;
    modalTitle: string = 'REGISTRAR MODULO';
    modalConfig: boolean = false;
    moduloForm!: FormGroup;
    private alert: AlertaSwal;

    constructor(private cdr: ChangeDetectorRef) {
        this.alert = new AlertaSwal();
        const id = this.usuarioService.currentUser().id;
        this.obtenerSedes(id);
        this.obtenermodulos(id);
        if (this.usuarioService.currentUser().tipo_usuario != 'SUPER_ADMIN') {
            this.listaSedesByEmpresa(this.usuarioService.currentUser().empresa.id);
        }
    }
    ngOnInit(): void {
        this.moduloForm = new FormGroup({
            id: new FormControl(Validators.required),
            nombre: new FormControl(''),
            estado: new FormControl('A'),
            created_at: new FormControl(''),
            sede: new FormControl(''),
            sede_id: new FormControl([Validators.required]),
            empresa_id: new FormControl(this.usuarioService.currentUser().empresa.id),
        });
        this.cdr.markForCheck();
    }

    obtenermodulos(id_user: number): void {
        this.service.obtenerModulos(id_user).subscribe({
            next: (data) => {
                this.service._lista_modulos.set(data);
                this.alert.close();
            },
            error: (err) => {
                this.alert.close();
            },
        });
    }

    nuevoModulo(): void {
        const form = { ...this.moduloForm.value, empresa_id: this.usuarioService.currentUser().empresa.id };
        this.alert.loading();
        this.service.nuevoModulo(form).subscribe({
            next: (value: Modulo) => {
                // const sede = this._sedes_Service.lista_sedes().find(
                //     (m) => m.id == this.moduloForm.value.sede_id
                // );
                // value.sede = sede;
                // this.service._lista_modulos.set([
                //     ...(this.service.lista_modulos() || []),
                //     value,
                // ]);
                this.modalNuevaSede = false;

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "!NOTIFICACION¡",
                    text: "Módulo creado exitosamente",
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.obtenermodulos(this.usuarioService.currentUser().id);
                    }
                });
            },
            error: (err) => {
                this.alert.close();
            },
        });

    }

    setModulo(modulo: Modulo): void {
        const m = { ...modulo, empresa_id: modulo.sede.empresa_id };
        this.listaSedesByEmpresa(modulo.sede.empresa_id);
        this.moduloForm.setValue(m);
        this.modalTitle = `MODIFICAR ${modulo.nombre}`;
        this.modalNuevaSede = true;
    }

    actualizarModulo(sede: Modulo): void {
        this.alert.loading();
        this.service.actualizarModulo(sede.id, sede).subscribe({
            next: (value: any) => {
                const i = this.service.lista_modulos().findIndex(
                    (e) => e.id == this.moduloForm.value.id
                );
                this.service._lista_modulos.update((empresas) => {
                    empresas.splice(i);
                    const sed = this._sedes_Service.lista_sedes().find(
                        (s) => s.id == this.moduloForm.value.sede_id
                    );
                    this.moduloForm.value.sede = sed;
                    empresas.push(this.moduloForm.value);
                    return empresas;
                });
                this.modalNuevaSede = false;
                this.alert.showMessage({
                    position: "center",
                    icon: value.STATUS ? "success" : "error",
                    title: "!NOTIFICACION¡",
                    text: value.MSG,
                    showConfirmButton: true,
                });
            },
            error: (err) => {
                this.alert.close();
            },
        });

    }

    uiEstado(sede: Modulo): void {
        this.alert.loading();
        this.service.uiEstado(sede).subscribe({
            next: (value: Modulo) => {
                this.service._lista_modulos.update((empresas) => {
                    empresas.find((e) => e.id == sede.id).estado =
                        sede.estado == 'A' ? 'I' : 'A';
                    this.alert.close();
                    return empresas;
                });
            },
            error: (err) => {
                this.alert.close();
            },
        });
    }

    close(): void {
        this.moduloForm.reset({
            id: '',
            empresa_id: '',
            nombre: '',
            direccion: '',
            estado: '',
            created_at: '',
            empresa: '',
        });
    }

    obtenerSedes(id_user: number) {
        if (this.sedesService.lista_sedes().length > 0) return;
        const r = this.sedesService.lista_sedes().find((sede) => sede.id == 0);
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

    listaSedesByEmpresa(id_empresa: number, accion = 'N') {
        const usuario = this.usuarioService.currentUser();
        this._sedes_Service
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

    configModulo(modulo: Modulo | null, accion: string): void {
        const usuario = this.usuarioService.currentUser();
        if (accion == 'C') {
            this.moduloSeleccionado = modulo;
            this.obtenerServicios(usuario.empresa.id, modulo.id, modulo.sede.id);
        }
        if (accion == 'G') {
            this.alert.loading();
            const servicios = [];
            if (this.serviciosSeleccionados.length > 0) {
                this.serviciosSeleccionados.forEach((s) => {
                    const ser = { sede_id: s.sede.id, servicio_id: s.id, modulo_id: this.moduloSeleccionado.id };
                    servicios.push(ser);
                });
            }
            else {
                this.serviciosDisponibles.forEach((s) => {
                    const ser = { sede_id: s.sede.id, servicio_id: s.id, modulo_id: null };
                    servicios.push(ser);
                });
            }
            this.service.configModuloServicio(servicios).subscribe({
                next: (value: any) => {
                    this.modalConfig = false;
                    this.alert.showMessage({
                        position: "center",
                        icon: value.STATUS ? "success" : "error",
                        title: "!NOTIFICACION¡",
                        text: value.MSG,
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
    }

    obtenerServicios(empresa_id: number, modulo_id: number, sede_id: number): void {
        this.alert.loading();
        this.serviciosService.obtenerServiciosConfig(empresa_id, modulo_id, sede_id).subscribe({
            next: (response: any) => {
                if (response.STATUS) {
                    this.serviciosDisponibles = response.MSG.filter(servicioMsg =>
                        !response.DATA.some(servicioData => servicioData.id === servicioMsg.id)
                    );

                    this.serviciosSeleccionados = response.DATA;
                    // this.serviciosDisponibles =
                    //     data.MSG.array.forEach((sd: any) => {
                    //         data.DATA != null ? data.DATA : [].forEach((ss: any) => {
                    //             console.log(`el servicio ${sd.nombre} se encuentra en ${ss.modulo.nombre}`);

                    //         })
                    //     }).filter((servicio: any) =>
                    //         servicio.modulo.id == null
                    //     );
                    // this.serviciosSeleccionados = data.DATA != null ? data.DATA : [];
                    this.modalConfig = true;
                    this.alert.close();
                }
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
}
