import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertaSwal } from 'src/app/components/swal-alert';
import { Modulo } from 'src/app/interfaces/modulo.interface';
import { Sede } from 'src/app/interfaces/sede.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ModuloService } from 'src/app/services/modulo.service';
import { SedesService } from 'src/app/services/sedes.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

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
    listaSedesFilter: Sede[] = [];
    public getStatus = inject(UtilitiesService).getStatus;
    modalNuevaSede: boolean = false;
    modalTitle: string = 'REGISTRAR MODULO';
    moduloForm!: FormGroup;
    private alert: AlertaSwal;

    constructor() {
        this.alert = new AlertaSwal();
        const id = this.usuarioService.currentUser().id;
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
        this.alert.loading();
        this.service.nuevoModulo(this.moduloForm.value).subscribe({
            next: (value: Modulo) => {
                const sede = this._sedes_Service.lista_sedes().find(
                    (m) => m.id == this.moduloForm.value.sede_id
                );
                value.sede = sede;
                this.service._lista_modulos.set([
                    ...(this.service.lista_modulos() || []),
                    value,
                ]);
                this.alert.close();
                this.modalNuevaSede = false;
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
                this.alert.close();
                this.modalNuevaSede = false;
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

    listaSedesByEmpresa(id_empresa: number, accion = 'N') {
        const usuario = this.usuarioService.currentUser();
        this.listaSedesFilter = this._sedes_Service
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
}
