import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './views/notfound/notfound.component';
import { authGuard } from './guards/authGuard.guard';
import { autoLoginGuard } from './guards/autoLogin.guard';
import { isAdminGuard } from './guards/isAdmin.guard';
import { isSuperAdminGuard } from './guards/isSuperAdmin.guard';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: 'home',
                    component: AppLayoutComponent,
                    canActivate: [authGuard],
                    children: [
                        {
                            path: '',
                            title: 'Dashboard',
                            canActivate: [isAdminGuard],
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
                                    canActivate: [isSuperAdminGuard],
                                    loadComponent: () =>
                                        import(
                                            './views/empresas/empresas.component'
                                        ),
                                },
                                {
                                    path: 'sedes',
                                    title: 'Sedes',
                                    canActivate: [isAdminGuard],
                                    data: ['pi pi-fw pi-sitemap'],
                                    loadComponent: () =>
                                        import('./views/sedes/sedes.component'),
                                },
                                {
                                    path: 'modulos',
                                    title: 'Modulos',
                                    canActivate: [isAdminGuard],
                                    data: ['pi pi-fw pi-tag'],
                                    loadComponent: () =>
                                        import(
                                            './views/modulos/modulos.component'
                                        ),
                                },
                                {
                                    path: 'servicios',
                                    title: 'Servicios',
                                    canActivate: [isAdminGuard],
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
                                    canActivate: [isAdminGuard],
                                    data: ['pi pi-users'],
                                    loadComponent: () =>
                                        import(
                                            './views/usuarios/usuarios.component'
                                        ),
                                },
                                {
                                    path: 'clientes',
                                    title: 'Clientes',
                                    data: ['pi pi-users'],
                                    loadComponent: () =>
                                        import(
                                            './views/clientes/clientes.component'
                                        ),
                                },
                                {
                                    path: 'menus',
                                    title: 'Menus',
                                    canActivate: [isAdminGuard],
                                    data: ['pi pi-bars'],
                                    loadComponent: () =>
                                        import('./views/menu/menu.component'),
                                },
                                {
                                    path: 'organigrama',
                                    title: 'Organigrama',
                                    canActivate: [isAdminGuard],
                                    data: ['pi pi pi-sitemap'],
                                    loadComponent: () =>
                                        import('./views/organigrama/organigrama.component'),
                                },
                            ],
                        },
                        {
                            path: '',
                            title: 'GESTION TURNOS',
                            children: [
                                {
                                    path: 'nuevo-turno',
                                    title: 'Generar',
                                    data: ['pi pi-ticket'],
                                    loadComponent: () =>
                                        import(
                                            './views/gestion_turnos/generar/generar.component'
                                        ),
                                },
                                {
                                    path: 'reporte-turnos',
                                    title: 'Reporte',
                                    canActivate: [isAdminGuard],
                                    data: ['pi pi-chart-line'],
                                    loadComponent: () =>
                                        import(
                                            './views/gestion_turnos/reportes/reportes.component'
                                        ),
                                },
                                {
                                    path: 'gestion-turno',
                                    title: 'Gestion',
                                    data: ['pi pi-megaphone'],
                                    loadComponent: () =>
                                        import(
                                            './views/gestion_turnos/gestionar/gestionar.component'
                                        ),
                                },
                            ],
                        },
                        {
                            path: '',
                            title: 'PANTALLA',
                            children: [
                                {
                                    path: 'admin-pantalla',
                                    title: 'Admin Pantalla',
                                    data: ['pi pi-ticket'],
                                    loadComponent: () =>
                                        import(
                                            './views/admin-pantalla/admin-pantalla.component'
                                        ),
                                },
                            ],
                        },
                    ],
                },
                {
                    path: 'pantalla',
                    title: 'Pantalla',
                    canActivate: [authGuard],
                    loadComponent: () => import('./views/pantalla/pantalla.component'),
                },
                {
                    path: '',
                    canActivate: [autoLoginGuard],
                    loadComponent: () => import('./views/auth/auth.component'),
                },

                { path: 'notfound', component: NotfoundComponent },
                // { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
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
export class AppRoutingModule { }
