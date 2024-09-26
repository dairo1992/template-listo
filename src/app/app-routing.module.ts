import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './views/notfound/notfound.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
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
                                    path: 'usuarios',
                                    title: 'Usuarios',
                                    data: ['pi pi-fw pi-users'],
                                    loadComponent: () =>
                                        import(
                                            './views/talento-humano/funcionario/funcionario.component'
                                        ),
                                },
                                {
                                    path: 'areas',
                                    title: 'Areas',
                                    data: ['pi pi-fw pi-sitemap'],
                                    loadComponent: () =>
                                        import(
                                            './views/talento-humano/area/area.component'
                                        ),
                                },
                                {
                                    path: 'cargos',
                                    title: 'Cargos',
                                    data: ['pi pi-fw pi-tag'],
                                    loadComponent: () =>
                                        import(
                                            './views/talento-humano/cargo/cargo.component'
                                        ),
                                },
                                {
                                    path: 'sedes',
                                    title: 'Sedes',
                                    data: ['pi pi-building'],
                                    loadComponent: () =>
                                        import(
                                            './views/talento-humano/sede/sede.component'
                                        ),
                                },
                            ],
                        },
                    ],
                },
                {
                    path: 'auth',
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
