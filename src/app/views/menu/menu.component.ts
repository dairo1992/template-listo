import { Component, inject, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { ModuloService } from 'src/app/services/modulo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { icons } from 'src/environments/environment';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
})
export default class MenuComponent implements OnInit {
    private usuariosService = inject(UsuarioService);
    private menuService = inject(ModuloService);
    items: MenuItem[] | undefined;
    activeItem: MenuItem | undefined;
    menu: Route;
    expandedRows = {};
    menus = [];
    modalIcon: boolean = false;
    icons = [];
    iconsTemp = [];
    query: string;
    nuevoModulo = {
        label_menu: '',
        label: '',
        icon: '',
        routerLink: '',
    };
    constructor() {
        this.limpiarForm();
        this.icons = icons;
        this.iconsTemp = icons;
        this.menu = {
            path: '',
            title: 'prueba',
            data: ['pi pi-fw pi-home'],
        };
        this.usuariosService
            .obt_modulos(this.usuariosService.currentUser().id)
            .subscribe({
                next: (menus: any) => {
                    this.menus = menus.menu.filter(
                        (m) => m.label != 'Dashboard'
                    );
                },
            });
        // this.activeItem = this.items[0];
    }

    ngOnInit() {
        this.items = [
            { id: '0', label: 'CREAR MENU', icon: '' },
            { id: '1', label: 'CREAR MODULO', icon: '' },
        ];

        this.activeItem = this.items[0];
    }

    limpiarForm() {
        this.nuevoModulo = {
            label_menu: '',
            label: '',
            icon: '',
            routerLink: '',
        };
    }

    removerMenu(menu: any) {
        if (menu.hasOwnProperty('routerLink')) {
            for (let ip = 0; ip < this.menus.length; ip++) {
                for (let ih = 0; ih < this.menus[ip].items.length; ih++) {
                    let i = this.menus[ip].items.findIndex(
                        (c: any) => c.routerLink == menu.routerLink
                    );
                    if (i > -1) {
                        console.log({ index: i, padre_index: ip });
                        this.menus[ip].items.splice(i, 1);
                        break;
                    }
                }
            }
            this.menuService.uiMenu(this.menus);
        } else {
            let i = this.menus.findIndex((m) => m.label == menu.label);
            this.menus.splice(i, 1);
            this.menuService.uiMenu(this.menus);
        }
    }

    uiMenus(form: any) {
        if (this.activeItem.id == '0') {
            this.menus.push({ label: form.label_menu, items: [] });
        } else {
            let i = this.menus.findIndex((m) => m.label == form.label_menu);
            this.menus[i].items.push({
                label: form.label,
                icon: form.icon == '' ? 'pi pi-info' : form.icon,
                routerLink: form.routerLink,
            });
        }
        this.menuService.uiMenu(this.menus);
        this.limpiarForm();
    }

    SelectIcon(icon: string) {
        this.nuevoModulo.icon = icon;
        this.modalIcon = false;
    }

    onActiveItemChange(event: MenuItem) {
        this.activeItem = event;
    }

    filterIcon(query: string) {
        if (query == '') {
            this.iconsTemp = this.icons;
        } else {
            this.iconsTemp = this.icons.filter((i) => i.includes(query));
        }
    }
}
