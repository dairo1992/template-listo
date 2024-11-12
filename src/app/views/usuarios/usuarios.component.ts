import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem, TreeNode } from 'primeng/api';
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
    public utilitiService = inject(UtilitiesService);
    public listaEmpresas = inject(EmpresaService).lista_empresas;
    public tiposUsuario = ['ADMIN', 'EMPLEADO', 'SUPER_ADMIN'];
    public usuarioSelected: Usuario = null;
    public menuUser: TreeNode[] = [];
    public menuFull: TreeNode[] = [];
    selected: TreeNode[];
    selected_user: TreeNode[];
    items: MenuItem[];
    rowSelect: Usuario;
    modals = {
        modalTitle: 'REGISTRAR NUEVO USUARIO',
        nuevoUsuario: false,
        config: false,
        password: false,
    };
    public modalTitle: string = 'REGISTRAR NUEVO USUARIO';
    public modalNuevoUsuario: boolean = false;
    public modalConfig: boolean = false;
    resetPassword = {
        password: '',
        confirmar_password: '',
    };

    constructor() {
        this.formUsuario = new FormGroup({
            id: new FormControl(0, Validators.required),
            nombre: new FormControl('', Validators.required),
            apellido: new FormControl('', Validators.required),
            documento: new FormControl('', Validators.required),
            tipo_usuario: new FormControl('', Validators.required),
            estado: new FormControl('A'),
            empresa_id: new FormControl(0),
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
                label: 'Config',
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
        ];
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
        };
        this.formUsuario.setValue(usuarioTemp);
        this.modalTitle = `MODIFICAR ${usuario.nombre}`;
        this.modalNuevoUsuario = true;
    }

    setRow(usuario: Usuario): void {
        this.rowSelect = usuario;
    }

    close(modal: string = ''): void {
        this.modalTitle = 'REGISTRAR NUEVO USUARIO';
        this.formUsuario.reset({
            id: 0,
            nombre: '',
            apellido: '',
            documento: '',
            tipo_usuario: '',
            estado: 'A',
            empresa_id: 0,
        });
        if (modal == 'config_modulo') {
            this.menuFull = [];
            this.selected = undefined;
        }
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

    configUsuario(usuario: Usuario) {
        this.menuFull = [];
        this.menuUser = [];
        this.service.obt_modulos(usuario.id).subscribe({
            next: (response: any) => {
                response.menu.map((m: any, i: number) => {
                    this.menuFull.push({
                        key: `${i + 1}`,
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
            // error: (error) => (this.jsonMenu = { menu: [], usuarioMenu: [] }),
        });
        this.usuarioSelected = usuario;
        this.modalConfig = true;
        this.modalTitle = `CONFIGURACION DE USUARIO`;
    }

    agregarModulo() {
        this.selected.forEach((s, is) => {
            if (s.parent != undefined) {
                // se escogio 1 de n modulos
                let children = [];
                let i = this.menuUser.findIndex((m) => m.key == s.parent.key);
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
                        (c) => c.key == s.key
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
        this.service.actualizarmodulos(
            this.usuarioSelected.id,
            this.treeNodeToRuta(this.menuUser)
        );
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
        );
        this.modals.password = false;
        this.resetPassword = {
            password: '',
            confirmar_password: '',
        };
    }
}
