import { inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { MenuService } from './app.menu.service';
import { UsuarioService } from '../services/usuario.service';
import { AlmacenService } from '../services/storage.service';

interface MODEL {
    label: string;
    items: RUTA[];
}

interface RUTA {
    label: string;
    icon: string;
    routerLink: [];
}

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    rutas = [];
    rutas_temp = [];
    public service = inject(MenuService);
    public almacen = inject(AlmacenService);
    private usuarioService = inject(UsuarioService);

    constructor(public layoutService: LayoutService, private routes: Router) {
    }

    ngOnInit() {
        this.rutas = this.almacen.obtenerRutas();
        this.rutas_temp = this.routes.config.filter(
            (r) => r.path != '**' && r.path != 'notfound' && r.path != 'auth'
        );

        // this.rutas_temp[0].children.map((r: any) => {
        //     this.rutas.push({
        //         label: r.title,
        //         items:
        //             r.children != undefined
        //                 ? r.children.map((c: any) => {
        //                       return {
        //                           label: c.title,
        //                           icon: c.data[0],
        //                           routerLink: c.path,
        //                       };
        //                   })
        //                 : [
        //                       {
        //                           label: r.title,
        //                           icon: r.data[0],
        //                           routerLink: '/',
        //                       },
        //                   ],
        //     });
        // });
        // console.log(this.rutas);
    }
}
