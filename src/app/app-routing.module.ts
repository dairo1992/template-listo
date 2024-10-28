import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './views/notfound/notfound.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: 'home',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: '',
                            title: 'Dashboard',
                            data: ['pi pi-fw pi-home'],
                            loadComponent: () =>
                                import('./views/dashboard/dashboard.component'),
                        },
                        {
                            path: '',
                            title: 'Administracion',
                            children: [
                                {
                                    path: 'empresas',
                                    title: 'Empresas',
                                    data: ['pi pi-fw pi-building'],
                                    loadComponent: () =>
                                        import(
                                            './views/empresas/empresas.component'
                                        ),
                                },
                                {
                                    path: 'sedes',
                                    title: 'Sedes',
                                    data: ['pi pi-fw pi-sitemap'],
                                    loadComponent: () =>
                                        import('./views/sedes/sedes.component'),
                                },
                                {
                                    path: 'modulos',
                                    title: 'Modulos',
                                    data: ['pi pi-fw pi-tag'],
                                    loadComponent: () =>
                                        import(
                                            './views/modulos/modulos.component'
                                        ),
                                },
                                {
                                    path: 'servicios',
                                    title: 'Servicios',
                                    data: ['pi pi-building'],
                                    loadComponent: () =>
                                        import(
                                            './views/servicios/servicios.component'
                                        ),
                                },
                            ],
                        },
                        {
                            path: '',
                            title: 'Usuarios',
                            children: [
                                {
                                    path: 'usuarios',
                                    title: 'Usuarios',
                                    data: ['pi pi-users'],
                                    loadComponent: () =>
                                        import(
                                            './views/usuarios/usuarios.component'
                                        ),
                                },
                                {
                                    path: 'menus',
                                    title: 'Menus',
                                    data: ['pi pi-bars'],
                                    loadComponent: () =>
                                        import('./views/menu/menu.component'),
                                },
                            ],
                        },
                    ],
                },
                {
                    path: '',
                    loadComponent: () => import('./views/auth/auth.component'),
                },
                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
