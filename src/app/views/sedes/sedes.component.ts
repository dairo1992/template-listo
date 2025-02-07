import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AlertaSwal } from 'src/app/components/swal-alert';
import { Sede } from 'src/app/interfaces/sede.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SedesService } from 'src/app/services/sedes.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
    selector: 'app-sedes',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './sedes.component.html',
    styleUrl: './sedes.component.scss',
})
export default class SedesComponent implements OnInit {
    public service = inject(SedesService);
    public usuarioService = inject(UsuarioService);
    public empresasService = inject(EmpresaService);
    public getStatus = inject(UtilitiesService).getStatus;
    modalNuevaSede: boolean = false;
    modalTitle: string = 'REGISTRAR SEDE';
    sedeForm!: FormGroup;
    currentUser: Usuario;
    private alert: AlertaSwal = new AlertaSwal();

    constructor() {
        this.currentUser = this.usuarioService.currentUser();
        this.obtenerSedes(this.currentUser.id);
        // this.empresasService.obtenerEmpresas(id);
    }
    ngOnInit(): void {
        this.sedeForm = new FormGroup({
            id: new FormControl(Validators.required),
            empresa_id: new FormControl([Validators.required]),
            nombre: new FormControl(''),
            direccion: new FormControl('', Validators.required),
            estado: new FormControl('A'),
            created_at: new FormControl(''),
            empresa: new FormControl(),
        });
    }

    obtenerSedes(id_user: number): void {
        this.alert.loading();
        this.service.obtenerSedes(id_user).subscribe({
            next: (data) => {
                this.service._lista_sedes.set(data);
                this.alert.close();
            },
            error: (err) => {
                this.alert.close();
            },
        });
    }

    nuevaSede(): void {
        this.alert.loading('Almacenando datos');
        this.modalNuevaSede = false;
        if (this.currentUser.tipo_usuario != 'SUPER_ADMIN') {
            this.sedeForm.controls['empresa_id'].setValue(
                this.currentUser.empresa.id
            );
        }
        this.service.nuevaSede(this.sedeForm.value)
            .subscribe({
                next: (value: Sede) => {
                    this.service._lista_sedes.set([...(this.service.lista_sedes() || []), value]);
                    this.alert.showMessage({
                        position: "center",
                        icon: "success",
                        title: "!NOTIFICACION¡",
                        text: `${value.nombre.toUpperCase()} CREADA CORRECTAMENTE`,
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

    setEmpresa(sede: Sede): void {
        this.sedeForm.setValue(sede);
        this.modalTitle = `MODIFICAR ${sede.nombre}`;
        this.modalNuevaSede = true;
    }

    actualizarEmpresa(sede: Sede): void {
        this.alert.loading();
        this.service.actualizarSede(sede.id, sede).subscribe({
            next: (value: any) => {
                const i = this.service.lista_sedes().findIndex((e) => e.id == sede.id);
                this.service._lista_sedes.update((empresas) => {
                    empresas.splice(i);
                    empresas.push(sede);
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

    uiEstado(sede: Sede): void {
        this.alert.loading();
        this.service.uiEstado(sede).subscribe({
            next: (value: Sede) => {
                this.service._lista_sedes.update((empresas) => {
                    empresas.find((e) => e.id == sede.id).estado =
                        sede.estado == 'A' ? 'I' : 'A';
                    return empresas;
                });
                this.alert.close();
            },
            error: (err) => {
                this.alert.close();
            },
        });
    }

    close(): void {
        this.sedeForm.reset({
            id: 0,
            nombre: '',
            direccion: '',
            estado: 'A',
            created_at: '',
            empresa: '',
        });
        // this.ngOnInit();
    }
}
