import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
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

    constructor() {
        this.currentUser = this.usuarioService.currentUser();
        this.service.obtenerSedes(this.currentUser.id);
        this.empresasService.obtenerEmpresas(
            this.usuarioService.currentUser().id
        );
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

    nuevaEmpresa(): void {
        if (this.currentUser.tipo_usuario != 'SUPER_ADMIN') {
            this.sedeForm.controls['empresa_id'].setValue(
                this.currentUser.empresa.id
            );
        }
        this.service.nuevaSede(this.sedeForm.value);
        this.modalNuevaSede = false;
    }

    setEmpresa(sede: Sede): void {
        this.sedeForm.setValue(sede);
        this.modalTitle = `MODIFICAR ${sede.nombre}`;
        this.modalNuevaSede = true;
    }

    actualizarEmpresa(sede: Sede): void {
        this.service.actualizarSede(sede.id, sede);
        this.modalNuevaSede = false;
    }

    uiEstado(sede: Sede): void {
        this.service.uiEstado(sede);
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
