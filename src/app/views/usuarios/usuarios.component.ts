import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { EmpresaService } from 'src/app/services/empresa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
    selector: 'app-usuarios',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.component.scss',
})
export default class UsuariosComponent {
    formUsuario: FormGroup;
    public service = inject(UsuarioService);
    public getStatus = inject(UtilitiesService).getStatus;
    public listaEmpresas = inject(EmpresaService).lista_empresas;
    public modalTitle: string = 'REGISTRAR NUEVO USUARIO';
    public modalNuevoUsuario: boolean = false;
    public tiposUsuario = ['ADMIN', 'EMPLEADO', 'SUPER_ADMIN'];

    constructor() {
        this.formUsuario = new FormGroup({
            id: new FormControl(0, Validators.required),
            nombre: new FormControl('', Validators.required),
            apellido: new FormControl('', Validators.required),
            documento: new FormControl('', Validators.required),
            tipo_usuario: new FormControl('', Validators.required),
            estado: new FormControl('A'),
            empresa: new FormControl(0),
        });
    }

    setEmpresa(usuario: Usuario): void {
        // empresa.horario_atencion = new Date(empresa.horario_atencion);
        this.formUsuario.setValue(usuario);
        this.modalTitle = `MODIFICAR ${usuario.nombre}`;
        this.modalNuevoUsuario = true;
    }

    close(): void {
        this.formUsuario.reset({
            id: 0,
            nombre: '',
            apellido: '',
            documento: '',
            tipo_usuario: '',
            estado: 'A',
        });
    }

    nuevoUsuario(): void {
        this.service.nuevaUsuario(this.formUsuario.value);
        this.modalNuevoUsuario = false;
    }
    actualizarUsuario(usuario: Usuario): void {
        this.service.actualizarUsuario(usuario.id, usuario);
        this.modalNuevoUsuario = false;
    }

    uiEstado(usuario: Usuario): void {
        this.service.uiEstado(usuario);
    }
}
