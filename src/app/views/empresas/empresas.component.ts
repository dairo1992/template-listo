import { Empresa } from 'src/app/interfaces/empresa.interface';
import { PrimeModule } from './../../layout/prime-module/prime-module.module';
import { Component, inject, OnInit } from '@angular/core';
import { EmpresaService } from 'src/app/services/empresa.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { UsuarioService } from 'src/app/services/usuario.service';

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
    constructor() {
        this.service.obtenerEmpresas(this.usuarioservice.currentUser().id);
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

    nuevaEmpresa(): void {
        this.service.nuevaEmpresa(this.empresaForm.value);
        this.modalNuevaEmpresa = false;
    }

    setEmpresa(empresa: Empresa): void {
        // empresa.horario_atencion = new Date(empresa.horario_atencion);
        this.empresaForm.setValue(empresa);
        this.modalTitle = `MODIFICAR ${empresa.nombre}`;
        this.modalNuevaEmpresa = true;
    }

    actualizarEmpresa(empresa: Empresa): void {
        this.service.actualizarEmpresa(empresa.id, empresa);
        this.modalNuevaEmpresa = false;
    }

    uiEstado(empresa: Empresa): void {
        this.service.uiEstado(empresa);
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
