import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { MenuService } from './app.menu.service';
import { AuthserviceService } from '../services/authservice.service';
import { Usuario } from '../interfaces/usuario.interface';
import { UsuarioService } from '../services/usuario.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
    items!: MenuItem[];
    itemsTopbar: MenuItem[] | undefined;
    @Input() minimal: boolean = false;
    private usuarioService = inject(UsuarioService);
    // public service = inject(UsuarioService);
    public currentUser: Usuario;
    scales: number[] = [12, 13, 14, 15, 16];
    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthserviceService,
        public menuService: MenuService
    ) {
        this.currentUser = this.usuarioService.currentUser();
        this.layoutService.config.update((config) => ({
            ...config,
            ripple: true,
            theme: 'lara-dark-teal',
            colorScheme: 'dark',
        }));
        this.itemsTopbar = [
            {
                label: this.currentUser
                    ? this.currentUser.nombre.toUpperCase()
                    : 'Optiones',
                // label: 'Optiones',
                items: [
                    {
                        label: 'Perfil',
                        icon: 'pi pi-user',
                        command: () => {
                            this.profile();
                        },
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-power-off',
                        command: () => {
                            this.logout();
                        },
                    },
                ],
            },
        ];
    }

    profile() {}

    logout() {
        this.authService.logout();
    }

    set theme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            theme: val,
        }));
    }

    get colorScheme(): String {
        return this.layoutService.config().colorScheme;
    }

    changeTheme() {
        let theme: string = '';
        let colorScheme: string = '';
        //         'lara-light-teal', 'light'
        // 'lara-dark-teal', 'dark'
        // console.log("thema");

        if (this.colorScheme == 'dark') {
            colorScheme = 'light';
            theme = 'lara-light-teal';
        } else {
            colorScheme = 'dark';
            theme = 'lara-dark-teal';
        }
        this.layoutService.config.update((config) => ({
            ...config,
            ripple: true,
            theme: theme,
            colorScheme: colorScheme,
        }));
    }
}
