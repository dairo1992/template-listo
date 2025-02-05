import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem, TreeNode } from 'primeng/api';
import { AlertaSwal } from 'src/app/components/swal-alert';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ModuloService } from 'src/app/services/modulo.service';
import { SedesService } from 'src/app/services/sedes.service';
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
    public utilitiService = inject(UtilitiesService);
    public empresaService = inject(EmpresaService);
    public sedeService = inject(SedesService);
    public modulosService = inject(ModuloService);
    public todosTiposUsuario = ['ADMIN', 'EMPLEADO', 'SUPER_ADMIN', 'PANTALLA'];
    public tiposUsuario = [];
    sedes = [];
    listaSedesFilter = [];
    listaModulosFilter = [];
    public usuarioSelected: Usuario = null;
    currentUser: Usuario;
    public menuUser: TreeNode[] = [];
    public menuFull: TreeNode[] = [];
    selected: TreeNode[];
    selected_user: TreeNode[];
    items: MenuItem[];
    rowSelect: Usuario;
    optionsPrioritarios = [
        { name: 'NO', id: 0 },
        { name: 'SI', id: 1 },
    ];
    modals = {
        modalTitle: 'REGISTRAR NUEVO USUARIO',
        nuevoUsuario: false,
        config: false,
        password: false,
        config_turnos: false,
    };
    resetPassword = {
        password: '',
        confirmar_password: '',
    };
    config_turnos = {
        sede_id: null,
        modulo_id: null,
        usuario_id: null,
    };
    private alert: AlertaSwal;

    constructor() {
        this.alert = new AlertaSwal();
        this.currentUser = this.service.currentUser();
        const id_user = this.currentUser.id;
        this.obtenerUsuarios(id_user);
        this.empresaService.obtenerEmpresas(id_user);
        this.sedeService.obtenerSedes(id_user);
        this.modulosService.obtenerModulos(id_user);
        this.setDropdownOptions();
        this.empresaService.obtenerEmpresas(
            id_user
        ).subscribe((data) => this.empresaService._lista_empresas.set(data));
        this.sedeService.obtenerSedes(
            id_user
        ).subscribe((data) => { this.sedeService._lista_sedes.set(data); this.sedes = this.sedeService.lista_sedes().filter((s) => s.id != 0) });
        this.modulosService.obtenerModulos(
            id_user
        ).subscribe((data) => this.modulosService._lista_modulos.set(data));
        this.formUsuario = new FormGroup({
            id: new FormControl(''),
            nombre: new FormControl('', Validators.required),
            apellido: new FormControl('', Validators.required),
            documento: new FormControl('', Validators.required),
            tipo_usuario: new FormControl('', Validators.required),
            estado: new FormControl('A'),
            empresa_id: new FormControl(this.currentUser.empresa.id),
            sede_id: new FormControl('', Validators.required),
        });
        this.items = [
            {
                label: 'Estado',
                icon: 'pi pi-check-circle',
                command: () => {
                    this.uiEstado(this.rowSelect);
                },
            },
            { separator: true },
            {
                label: 'Editar',
                icon: 'pi pi-user-edit',
                command: () => {
                    this.setUsuario(this.rowSelect);
                },
            },
            { separator: true },
            {
                label: 'Config Menu',
                icon: 'pi pi-wrench',
                command: () => {
                    this.configUsuario(this.rowSelect);
                },
            },
            { separator: true },
            {
                label: 'Cambiar Contraseña',
                icon: 'pi pi-key',
                command: () => {
                    this.usuarioSelected = this.rowSelect;
                    this.modals.modalTitle = `${this.rowSelect.nombre.toUpperCase()} ${this.rowSelect.apellido.toUpperCase()} `;
                    this.modals.password = true;
                },
            },
            { separator: true },
            {
                label: 'Config Turnos',
                icon: 'pi pi-bookmark',
                command: () => {
                    this.usuarioSelected = this.rowSelect;
                    this.config_turnos.usuario_id = this.usuarioSelected.id;
                    this.config_turnos.sede_id = this.usuarioSelected.sede.id;
                    // this.config_turnos.prioritarios =
                    //     this.usuarioSelected.prioritario != null ? this.usuarioSelected.prioritario : 0;
                    if (this.usuarioSelected.modulo != null) {
                        this.config_turnos.modulo_id = this.usuarioSelected.modulo.id;
                    }
                    this.listaModulosBySede(this.config_turnos.sede_id, 'E');
                    this.modals.modalTitle = `CONFIGURAR TURNOS PARA ${this.rowSelect.nombre.toUpperCase()} `;
                    this.modals.config_turnos = true;
                },
            },
        ];
    }

    obtenerUsuarios(id_user: number): void {
        this.alert.loading();
        this.service.obtenerUsuarios(id_user).subscribe({
            next: (data) => {
                this.alert.close();
                this.service._lista_usuarios.set(data);
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

    setDropdownOptions(): void {
        if (this.service.currentUser().tipo_usuario === 'SUPER_ADMIN') {
            this.tiposUsuario = this.todosTiposUsuario; // Mostrar todas las opciones si el usuario es SUPER_ADMIN
        } else {
            this.tiposUsuario = this.todosTiposUsuario.filter(
                (option) => option !== 'SUPER_ADMIN'
            ); // Excluir SUPER_ADMIN
        }
    }

    setUsuario(usuario: Usuario): void {
        // empresa.horario_atencion = new Date(empresa.horario_atencion);
        const usuarioTemp = {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            documento: usuario.documento,
            tipo_usuario: usuario.tipo_usuario,
            estado: usuario.estado,
            empresa_id: usuario.empresa.id,
            sede_id: usuario.sede.id,
        };
        this.formUsuario.setValue(usuarioTemp);
        this.modals.modalTitle = `MODIFICAR ${usuario.nombre}`;
        this.modals.nuevoUsuario = true;
    }

    setRow(usuario: Usuario): void {
        this.rowSelect = usuario;
    }

    close(modal: string = ''): void {
        this.modals.modalTitle = 'REGISTRAR NUEVO USUARIO';
        this.formUsuario.reset({
            id: '',
            nombre: '',
            apellido: '',
            documento: '',
            tipo_usuario: '',
            estado: 'A',
            empresa_id: '',
            sede_id: ''
        });
        if (modal == 'config_modulo') {
            this.menuFull = [];
            this.selected = undefined;
        }
    }

    nuevoUsuario(): void {
        this.alert.loading();
        if (this.currentUser.tipo_usuario != 'SUPER_ADMIN') {
            this.formUsuario.controls['empresa_id'].setValue(
                this.service.currentUser().empresa.id
            );
        }
        this.service.nuevaUsuario(this.formUsuario.value).subscribe({
            next: (value: Usuario) => {
                this.service._lista_usuarios.set([
                    ...(this.service.lista_usuarios() || []),
                    value,
                ]);
                this.alert.showMessage({
                    position: "center",
                    icon: "success",
                    title: "!NOTIFICACION¡",
                    text: `${value.nombre.toUpperCase()} CREADO CORRECTAMENTE`,
                    showConfirmButton: true,
                });
                this.modals.nuevoUsuario = false;
            },
            error: (err) => {
                this.modals.nuevoUsuario = false;
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

    actualizarUsuario(usuario: Usuario): void {
        this.service.actualizarUsuario(usuario.id, usuario).subscribe({
            next: (value: any) => {
                const i = this.service.lista_usuarios().findIndex((e) => e.id == usuario.id);
                this.service._lista_usuarios.update((usuarios) => {
                    const emp = this.empresaService
                        .lista_empresas()
                        .find((e) => e.id == this.service.lista_usuarios()[i].empresa.id);
                    const sede = this.sedeService
                        .lista_sedes()
                        .find((s) => s.id == this.service.lista_usuarios()[i].sede.id);
                    usuarios.splice(i, 1);
                    usuario.empresa = emp;
                    usuario.sede = sede;
                    usuarios.push(usuario);
                    return usuarios;
                });
                this.alert.showMessage({
                    position: "center",
                    icon: "success",
                    title: "!NOTIFICACION¡",
                    text: value.MSG,
                    showConfirmButton: true,
                });
                this.modals.nuevoUsuario = false;
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

    uiEstado(usuario: Usuario): void {
        this.service.uiEstado(usuario).subscribe({
            next: (value: Usuario) => {
                this.service._lista_usuarios.update((empresas) => {
                    empresas.find((e) => e.id == usuario.id).estado =
                        usuario.estado == 'A' ? 'I' : 'A';
                    return empresas;
                });
                this.alert.showMessage({
                    position: "center",
                    icon: "success",
                    title: "!NOTIFICACION¡",
                    text: `ACTUALIZADO CORRECTAMENTE`,
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

    configUsuario(usuario: Usuario) {
        this.alert.loading("Obteniendo modulos");
        this.menuFull = [];
        this.menuUser = [];
        this.service.obt_modulos(usuario.id).subscribe({
            next: (response: any) => {
                this.modals.config = true;
                response.menu.map((m: any, i: number) => {
                    this.menuFull.push({
                        key: `${i + 1}`,
                        label: m.label,
                        children: m.items.filter((c: any) => c.label != 'Empresas').map((c: any, p: number) => {
                            return {
                                key: `${i}-${p}`,
                                label: c.label,
                                data: c.routerLink,
                                icon: c.icon,
                            };
                        })
                    });
                    this.alert.close();
                });
                response.usuarioMenu.map((m: any, i: number) => {
                    this.menuUser.push({
                        key: `${i}`,
                        label: m.label,
                        children: m.items.map((c: any, p: number) => {
                            return {
                                key: `${i}-${p}`,
                                label: c.label,
                                data: c.routerLink,
                                icon: c.icon,
                            };
                        }),
                    });
                });
            },
            error: (error) => {
                this.alert.close();
            },
        });
        this.usuarioSelected = usuario;
        this.modals.modalTitle = `CONFIGURACION DE USUARIO`;
    }

    agregarModulo() {
        this.selected.forEach((s, is) => {
            if (s.parent != undefined) {
                // se escogio 1 de n modulos
                let children = [];
                let i = this.menuUser.findIndex(
                    (m) => m.label == s.parent.label
                );
                if (i == -1) {
                    this.menuUser.push({
                        key: s.parent.key,
                        label: s.parent.label,
                        children: children,
                    });
                    this.menuUser[this.menuUser.length - 1].children.push({
                        key: s.key,
                        label: s.label,
                        data: s.data,
                        icon: s.icon,
                    });
                } else {
                    let ic = this.menuUser[i].children.findIndex(
                        (c) => c.label == s.label
                    );
                    if (ic == -1) {
                        this.menuUser[i].children.push({
                            key: s.key,
                            label: s.label,
                            data: s.data,
                            icon: s.icon,
                        });
                    }
                }
            } else {
                // se escogieron todos los modulos
                if (is == 0) {
                    // buscando si existe padre
                    let i = this.menuUser.findIndex((m) => m.key == s.key);
                    if (i == -1) {
                        this.menuUser.push(s);
                    }
                } else {
                    // buscando si existe hijos
                    let i = this.menuUser[1].children.findIndex(
                        (c) => c.key == s.key && s.key.length > 1
                    );
                }
            }
        });
    }

    removerModulos() {
        this.selected_user.forEach((s, is) => {
            if (s.parent != undefined) {
                for (let i = 0; i < this.menuUser.length; i++) {
                    if (s.parent.key == this.menuUser[i].key) {
                        let ind = this.menuUser[i].children.findIndex(
                            (m) => m.key == s.key
                        );
                        if (ind > -1) {
                            this.menuUser[i].children.splice(ind, 1);
                        }
                    }
                    if (this.menuUser[i].children.length == 0) {
                        this.menuUser.splice(i, 1);
                    }
                }
            } else {
                for (let i = 0; i < this.menuUser.length; i++) {
                    if (s.key == this.menuUser[i].key) {
                        let ind = this.menuUser.findIndex(
                            (m) => m.key == this.menuUser[i].key
                        );
                        if (ind > -1) {
                            this.menuUser.splice(ind, 1);
                        }
                    }
                }
            }
        });
    }

    guardarModulos() {
        this.modals.config = false;
        this.service.actualizarmodulos(
            this.usuarioSelected.id,
            this.treeNodeToRuta(this.menuUser)
        ).subscribe({
            next: (value: Usuario) => {
                this.alert.showMessage({
                    position: "center",
                    icon: "success",
                    title: "!NOTIFICACION¡",
                    text: `ACTUALIZADO CORRECTAMENTE`,
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

    treeNodeToRuta(rutas: TreeNode[]) {
        return rutas.map((r) => {
            return {
                label: r.label,
                items: r.children.map((c) => {
                    return {
                        label: c.label,
                        icon: c.icon,
                        routerLink: c.data,
                    };
                }),
            };
        });
    }

    cambiarPassword() {
        if (
            this.resetPassword.password != this.resetPassword.confirmar_password
        )
            return this.utilitiService.notification({
                severity: 'warn',
                summary: '!NOTIFICACION¡',
                detail: 'LAS CONTRASEÑA NO CONCIDEN',
            });
        this.service.cambiarPassword(
            this.resetPassword,
            this.usuarioSelected.id
        ).subscribe({
            next: (response: any) => {
                this.modals.password = false;
                this.resetPassword = {
                    password: '',
                    confirmar_password: '',
                };
                this.alert.showMessage({
                    position: "center",
                    icon: response.STATUS ? 'success' : 'error',
                    title: "!NOTIFICACION¡",
                    text: response.MSG,
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

    config_turno() {
        if (this.config_turnos.modulo_id == 0) {
            return this.utilitiService.notification({
                severity: 'warn',
                summary: '!NOTIFICACION¡',
                detail: 'DEBE ELEGIR UN MODULO',
            });
        }
        this.modals.config_turnos = false;
        this.service.configurarTurno(this.config_turnos).subscribe({
            next: (response: any) => {
                this.alert.showMessage({
                    position: "center",
                    icon: response.STATUS ? 'success' : 'error',
                    title: "!NOTIFICACION¡",
                    text: response.MSG,
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

    listaSedesByEmpresa(id_empresa: number, accion = 'N') {
        console.log(this.sedeService
            .lista_sedes());

        const usuario = this.currentUser;
        this.listaSedesFilter = this.sedeService
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

    listaModulosBySede(id_sede: number, accion = 'N') {
        const usuario = this.currentUser;
        this.listaModulosFilter = this.modulosService
            .lista_modulos()
            .filter((modulo) => {
                if (accion === 'N' && usuario.tipo_usuario === 'SUPER_ADMIN') {
                    return modulo;
                } else {
                    if (modulo.sede_id == id_sede) {
                        return modulo;
                    }
                    return null;
                }
            });
    }
}
