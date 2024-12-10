import { formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { ClienteService } from 'src/app/services/cliente.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
    selector: 'app-clientes',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './clientes.component.html',
    styleUrl: './clientes.component.scss',
})
export default class ClientesComponent {
    params: any;
    formCliente!: FormGroup;
    clienteService = inject(ClienteService);
    usuarioService = inject(UsuarioService);
    empresaService = inject(EmpresaService);
    utilityService = inject(UtilitiesService);
    modals = {
        modalTitle: 'REGISTRAR NUEVO CLIENTE',
        nuevoCliente: false,
        // config: false,
        // password: false,
        // config_turnos: false,
    };

    constructor(private route: ActivatedRoute, private router: Router) {
        this.clienteService.obtenerClientes();
        this.empresaService.obtenerEmpresas(
            this.usuarioService.currentUser().tipo_usuario == 'SUPER_ADMIN' ? 0 : this.usuarioService.currentUser().id
        );
        this.formCliente = new FormGroup({
            id: new FormControl(0, Validators.required),
            tipo_documento: new FormControl(Validators.required),
            documento: new FormControl(0, Validators.required),
            nombre: new FormControl('', Validators.required),
            apellido: new FormControl('', Validators.required),
            telefono: new FormControl(Validators.required),
            email: new FormControl('', Validators.email),
            fecha_nacimiento: new FormControl(Validators.required),
            observaciones: new FormControl(''),
            empresa_id: new FormControl(0, Validators.required),
        });
    }

    // redirect() {
    //     this.params = this.route.snapshot.queryParams;
    //     if (this.params['accion'] != null) {
    //         this.modals.nuevoCliente = true;
    //         this.formCliente.controls['tipo_documento'].setValue(
    //             this.params['tipo']
    //         );
    //         this.formCliente.controls['documento'].setValue(this.params['doc']);
    //     }
    // }

    close(modal: string = ''): void {
        this.modals.modalTitle = 'REGISTRAR NUEVO USUARIO';
        this.modals.nuevoCliente = false;
        this.formCliente.reset({
            id: 0,
            tipo_documento: '',
            documento: '',
            nombre: '',
            apellido: '',
            telefono: '',
            email: '',
            fecha_nacimiento: '',
            observaciones: '',
            empresa_id: '',
        });
    }

    nuevoCliente() {
        const fecha = this.formCliente.value.fecha_nacimiento;
        const fecha_f = formatDate(new Date(fecha), 'yyyy-MM-dd', 'en-US');
        this.formCliente.controls['fecha_nacimiento'].setValue(fecha_f);
        this.formCliente.controls['empresa_id'].setValue(
            this.usuarioService.currentUser().empresa.id ?? 0
        );
        this.clienteService.nuevoCliente(this.formCliente.value);
        if (this.params['accion'] != null) {
            this.router.navigate(['/home/nuevo-turno'], {
                queryParams: {
                    accion: 'generar-turno',
                    cliente: JSON.stringify(this.formCliente.value),
                },
            });
        }
    }

    actualizarCliente() { }
}
