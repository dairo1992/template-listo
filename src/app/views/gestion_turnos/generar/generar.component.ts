import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { Servicio } from 'src/app/interfaces/servicio.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { ClienteService } from 'src/app/services/cliente.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { TicktTurnoComponent } from '../../ticket-turno/tickt-turno.component';
import ClientesComponent from "../../clientes/clientes.component";
import { AlertaSwal } from 'src/app/components/swal-alert';
import { SocketService } from 'src/app/services/socket.service';

@Component({
    selector: 'app-generar',
    standalone: true,
    imports: [PrimeModule, TicktTurnoComponent, ClientesComponent],
    templateUrl: './generar.component.html',
    styleUrl: './generar.component.scss',
})
export default class GenerarComponent implements OnInit {
    @ViewChild(TicktTurnoComponent) ticketComponent: TicktTurnoComponent;
    public Service = inject(TurnosService);
    public clienteService = inject(ClienteService);
    public usuarioService = inject(UsuarioService);
    public utilityService = inject(UtilitiesService);
    public empresaService = inject(EmpresaService);
    public ServicioService = inject(ServiciosService);
    private messageService = inject(MessageService);
    private socketService = inject(SocketService);
    paso: number = 1;
    turnoForm!: FormGroup;
    consultaForm!: FormGroup;
    formCliente!: FormGroup;
    prioritario: boolean = false;
    servicioSeleccionado: any = null;
    turnoGenerado: any = null;
    modalImprimir: boolean = false;
    alert: AlertaSwal;
    constructor() {
        this.limpiarForm();
        this.alert = new AlertaSwal();
    }
    ngOnInit(): void {
        this.utilityService.obtenerTiposDocumento();
    }

    limpiarForm(): void {
        this.consultaForm = new FormGroup({
            tipo_documento: new FormControl(Validators.required),
            documento: new FormControl(0, Validators.required),
            empresa_id: new FormControl(0, Validators.required),
        });
        this.formCliente = new FormGroup({
            id: new FormControl(0, Validators.required),
            tipo_documento: new FormControl(Validators.required),
            documento: new FormControl(0, Validators.required),
            nombre: new FormControl('', Validators.required),
            apellido: new FormControl('', Validators.required),
            telefono: new FormControl(Validators.required),
            email: new FormControl('', Validators.email),
            fecha_nacimiento: new FormControl('', Validators.required),
            observaciones: new FormControl(''),
            empresa_id: new FormControl(0, Validators.required),
        });
        this.turnoForm = new FormGroup({
            id: new FormControl(),
            usuario_id: new FormControl(
                this.usuarioService.currentUser().id,
                Validators.required
            ),
            servicio_id: new FormControl(Validators.required),
            modulo_id: new FormControl(Validators.required),
            sede_id: new FormControl(Validators.required),
            estado: new FormControl('A'),
            fecha_creacion: new FormControl(),
            hora_creacion: new FormControl(),
            fecha_atencion: new FormControl(),
            hora_atencion: new FormControl(),
            prioridad: new FormControl(Validators.required),
            cliente_id: new FormControl(Validators.required),
        });
    }

    consultarCliente() {
        this.alert.loading();
        const empresa_id = this.usuarioService.currentUser().empresa.id ?? 0;
        this.consultaForm.controls['empresa_id'].setValue(empresa_id);
        this.clienteService
            .consultarCliente(this.consultaForm.value)
            .subscribe({
                next: (resp: any) => {
                    this.paso = 2;
                    // this.clienteService.setLoading(false);
                    if (resp.STATUS) {
                        const cliente: Cliente = resp.MSG;
                        cliente.fecha_nacimiento = new Date(
                            cliente.fecha_nacimiento
                        ).toISOString();
                        this.formCliente.setValue(cliente);
                        this.formCliente.get('tipo_documento')?.disable();
                    } else {
                        this.formCliente.get('tipo_documento')?.enable();
                        this.formCliente.controls['id'].setValue(0);
                        this.formCliente.controls['empresa_id'].setValue(empresa_id);
                        this.formCliente.controls['tipo_documento'].setValue(this.consultaForm.value.tipo_documento);
                        this.formCliente.controls['documento'].setValue(this.consultaForm.value.documento);
                    }
                    this.alert.close();
                },
                error: (err) => {
                    this.alert.close();
                    this.messageService.add({
                        severity: 'warn',
                        summary: '!NOTIFICACION¡',
                        detail: err.error,
                    });
                },
            });
    }

    nuevoCliente() {
        this.alert.loading();
        this.ServicioService.obtenerServicios(
            this.usuarioService.currentUser().id
        ).subscribe((data) => this.ServicioService._lista_servicios.set(data));
        if (this.formCliente.value.id > 0) {
            this.paso = 3;
            this.alert.close();
        } else {
            this.clienteService.nuevoCliente(this.formCliente.value).subscribe({
                next: (value: Cliente) => {
                    this.paso = 3;
                    this.formCliente.setValue(value);
                    this.clienteService._cliente.set(value);
                    this.clienteService._lista_clientes.set([
                        ...(this.clienteService.lista_clientes() || []),
                        value,
                    ]);
                    this.messageService.add({
                        severity: 'success',
                        summary: `${value.nombre.toUpperCase()} CREADO CORRECTAMENTE`,
                    });
                    this.alert.close();
                },
                error: (err) => {
                    this.alert.close();
                    this.messageService.add({
                        severity: 'warn',
                        summary: '!NOTIFICACION¡',
                        detail: err.error,
                    });
                },
            });
        }
    }

    seleccionarServicio(servicio: Servicio) {
        this.servicioSeleccionado = servicio;
        const turno = {
            id: 0,
            usuario_id: this.usuarioService.currentUser().id,
            servicio_id: servicio.id,
            modulo_id: servicio.modulo.id,
            estado: 'P',
            fecha_creacion: new Date(),
            hora_creacion: new Date(),
            fecha_atencion: '',
            hora_atencion: '',
            prioridad: this.prioritario ? 1 : 0,
            cliente_id: this.formCliente.value.id,
        };
        this.turnoForm.setValue(turno);
    }

    generarTurno(servicio: Servicio) {
        this.alert.loading();
        this.servicioSeleccionado = servicio;
        const currentUser = this.usuarioService.currentUser();
        const turno = {
            id: 0,
            usuario_id: this.usuarioService.currentUser().id,
            servicio_id: servicio.id,
            modulo_id: servicio.modulo.id,
            sede_id: servicio.modulo.sede.id,
            estado: 'P',
            fecha_creacion: new Date(),
            hora_creacion: new Date(),
            fecha_atencion: '',
            hora_atencion: '',
            prioridad: this.prioritario ? 1 : 0,
            cliente_id: this.formCliente.value.id,
        };
        this.turnoForm.setValue(turno);
        this.Service.generarTurno(this.turnoForm.value).subscribe({
            next: (response: any) => {
                if (response.STATUS) {
                    this.Service.obtenerTurnosCant(
                        this.usuarioService.currentUser().id);
                }
                this.limpiarForm();
                // this.alert.showMessage({
                //     position: "center",
                //     icon: response.STATUS ? 'success' : 'error',
                //     title: "!NOTIFICACION¡",
                //     text: response.MSG,
                //     footer: response.DATA,
                //     showConfirmButton: true,
                // });
                this.messageService.add({
                    key: 'turno',
                    sticky: true,
                    severity: response.STATUS ? 'success' : 'warn',
                    summary: response.MSG,
                    detail: response.DATA,
                    data: response.TURNO_ID,
                });
                if (response.STATUS) {
                    this.socketService.emit('lista-turnos', { "empresa_id": currentUser.empresa.id, sede_id: currentUser.empresa.sede.id });
                    this.paso = 1;
                }
                // this.visible = true;
            },
            error: (err) => {
                this.alert.close();
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        });
    }

    imprimirTurno(id_turno: number) {
        this.alert.loading();
        this.modalImprimir = true;
        this.turnoGenerado = null;
        this.Service.imprimirTurno(id_turno).subscribe({
            next: (response: any) => {
                this.alert.close();
                if (response.STATUS) {
                    this.turnoGenerado = response.MSG;
                } else {
                    this.messageService.add({
                        severity: 'warn',
                        summary: '!NOTIFICACION¡',
                        detail: response.MSG,
                    });
                }
            },
            error: (err) => {
                this.alert.close();
                this.messageService.add({
                    severity: 'warn',
                    summary: '!NOTIFICACION¡',
                    detail: err.error,
                });
            },
        });
    }

   
}
