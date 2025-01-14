import { formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertaSwal } from 'src/app/components/swal-alert';
import { Cliente } from 'src/app/interfaces/cliente.interface';
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
    maxDate: Date = new Date();
    params: any;
    private alert: AlertaSwal = new AlertaSwal();
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
        this.obtenerClientes();
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

    obtenerClientes() {
        this.clienteService.obtenerClientes(this.usuarioService.currentUser().empresa.id ?? 0).subscribe({
            next: (data) => {
                this.alert.close();
                this.clienteService._lista_clientes.set(data);
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
        this.alert.loading();
        const fecha = this.formCliente.value.fecha_nacimiento;
        const fecha_f = formatDate(new Date(fecha), 'yyyy-MM-dd', 'en-US');
        this.formCliente.controls['fecha_nacimiento'].setValue(fecha_f);
        this.clienteService.nuevoCliente(this.formCliente.value).subscribe({
            next: (value: Cliente) => {
                this.clienteService._lista_clientes.set([
                    ...(this.clienteService.lista_clientes() || []),
                    value,
                ]);
                this.alert.showMessage({
                    position: "center",
                    icon: "success",
                    title: "!NOTIFICACION¡",
                    text: `${value.nombre.toUpperCase()} CREADO CORRECTAMENTE`,
                    showConfirmButton: true,
                });
                this.modals.nuevoCliente = false;
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
        // if (this.params['accion'] != null) {
        //     this.router.navigate(['/home/nuevo-turno'], {
        //         queryParams: {
        //             accion: 'generar-turno',
        //             cliente: JSON.stringify(this.formCliente.value),
        //         },
        //     });
        // }
    }

    actualizarCliente() { }
}
