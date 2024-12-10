import { computed, inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuChangeEvent } from './api/menuchangeevent';
import { Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { url } from 'src/environments/environment';
import { AlmacenService } from '../services/storage.service';

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    private http = inject(HttpClient);
    private almacen = inject(AlmacenService);
    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();
    public _isLoading = signal<boolean>(false);
    public isLoading = computed(() => this._isLoading());

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }

    // obtenerRutas(id_user: number) {
    //     this._isLoading.set(true);
    //     this.http.get<Routes[]>(`${url}/auth/menu/${id_user}`).subscribe({
    //         next: (rutas) => {
    //             this.almacen.almacenarRutas()
    //          },
    //         error: (err) => { }
    //     })
    // }
}
