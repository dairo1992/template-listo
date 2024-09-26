import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthserviceService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private messageService: MessageService,
        private storage: StorageService
    ) {}

    login(usuario: any) {
        // return this.http.post<DbResponse>(`${url}/`, usuario);
    }

    logout(): void {
        this.storage.limpiarStorage();
        this.router.navigateByUrl('/auth');
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Token Expirado',
        });
    }
}
