import { Empresa } from 'src/app/interfaces/empresa.interface';
import { PrimeModule } from './../../layout/prime-module/prime-module.module';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EmpresaService } from 'src/app/services/empresa.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertaSwal } from 'src/app/components/swal-alert';
import { Usuario } from 'src/app/interfaces/usuario.interface';

@Component({
    selector: 'app-empresas',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './empresas.component.html',
    styleUrl: './empresas.component.scss',
})
export default class EmpresasComponent implements OnInit {
    public service = inject(EmpresaService);
    private usuarioservice = inject(UsuarioService);
    public getStatus = inject(UtilitiesService).getStatus;

    modalNuevaEmpresa: boolean = false;
    modalTitle: string = 'REGISTRAR EMPRESA';
    empresaForm!: FormGroup;
    currentUser: Usuario;
    loading: boolean = true;
    private alert: AlertaSwal = new AlertaSwal();

    constructor() {
        this.currentUser = this.usuarioservice.currentUser();
        this.obtEmpresas();
    }
    ngOnInit(): void {
        this.empresaForm = new FormGroup({
            id: new FormControl(0, Validators.required),
            nit: new FormControl('', [
                Validators.required,
                Validators.pattern('^[0-9]{9,10}$'),
            ]),
            nombre: new FormControl('', Validators.required),
            direccion: new FormControl(''),
            estado: new FormControl('A'),
            created_at: new FormControl(''),
        });
    }

    obtEmpresas() {
        this.alert.loading();
        this.loading = true;
        this.service.obtenerEmpresas(this.currentUser.id).subscribe({
            next: (empresas) => {
                this.service._lista_empresas.set(empresas);
                this.alert.close();
                this.loading = false;
            },
            error: (err) => {
                this.alert.close();
                this.loading = false;
            }
        });
    }

    nuevaEmpresa(): void {
        this.alert.loading();
        this.service.nuevaEmpresa(this.empresaForm.value).subscribe({
            next: (empresa: Empresa) => {
                if (empresa != null) {
                    this.service._lista_empresas.set([
                        ...(this.service._lista_empresas() || []),
                        empresa,
                    ]);
                }
                this.modalNuevaEmpresa = false;
                this.alert.showMessage({
                    position: "center",
                    icon: "success",
                    title: "!NOTIFICACION¡",
                    text: `${empresa.nombre.toUpperCase()} CREADA CORRECTAMENTE`,
                    showConfirmButton: true,
                });
            },
            error: (err) => {
                this.alert.close();
                this.loading = false;
            }
        });
    }

    setEmpresa(empresa: Empresa): void {
        // empresa.horario_atencion = new Date(empresa.horario_atencion);
        this.empresaForm.setValue(empresa);
        this.modalTitle = `MODIFICAR ${empresa.nombre}`;
        this.modalNuevaEmpresa = true;
    }

    actualizarEmpresa(empresa: Empresa): void {
        this.alert.loading();
        this.service.actualizarEmpresa(empresa.id, empresa).subscribe({
            next: (value: Empresa) => {
                this.alert.close();
                const i = this.service.lista_empresas().findIndex(
                    (e) => e.id == empresa.id
                );
                this.service._lista_empresas.update((empresas) => {
                    empresas.splice(i);
                    empresas.push(empresa);
                    return empresas;
                });
                this.alert.close();
                this.modalNuevaEmpresa = false;
            },
            error: (err) => {
                this.alert.close();
                this.modalNuevaEmpresa = false;
            },
        });
    }

    uiEstado(empresa: Empresa): void {
        this.alert.loading();
        this.service.uiEstado(empresa)
            .subscribe({
                next: (value: any) => {
                    this.alert.close();
                    if (value.STATUS) {
                        this.service._lista_empresas.update((empresas: any) => {
                            empresas.find((e) => e.id == empresa.id).estado =
                                empresa.estado == 'A' ? 'I' : 'A';
                            return empresas;
                        });
                    }
                    this.alert.close();
                },
                error: (err) => {
                    this.alert.close();
                },
            });
    }

    close(): void {
        this.empresaForm.reset({
            id: 0,
            nit: '',
            nombre: '',
            direccion: '',
            estado: 'A',
        });
    }
}
