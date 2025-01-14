import { computed, inject, Injectable, signal } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import * as CryptoJS from 'crypto-js';
import { cryptoKey, url } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class UtilitiesService {
    private _tipos_documento = signal<[]>([]);
    public tipos_documento = computed(() => this._tipos_documento());
    private http = inject(HttpClient);
    constructor(private messageService: MessageService) {
        this.obtenerTiposDocumento();
    }

    getStatus(status: string) {
        switch (status) {
            case 'A': //ACTIVO
                return { color: 'success', nombre: 'ACTIVO' };
            case 'I': //INACTIVO
                return { color: 'danger', nombre: 'INACTIVO' };
            case 'P': //PENDIENTE
                return { color: 'info', nombre: 'PENDIENTE' };
            case 'F': //FINALIZADO
                return { color: 'help', nombre: 'FINALIZADO' };
            case 'E': //EN CURSO
                return { color: 'Primary', nombre: 'EN VISITA' };
            default: //DEFAULT
                return { color: 'erroring', nombre: 'INDEFINIDO' };
        }
    }

    getTurnoStatus(status: string) {
        switch (status) {
            case 'esperando': //ACTIVO
                return { color: 'info', nombre: 'EN ESPERA' };
            case 'en_atencion': //INACTIVO
                return { color: 'help', nombre: 'EN MODULO' };
            case 'atendido': //PENDIENTE
                return { color: 'success', nombre: 'ATENDIDO' };
            case 'anulado': //FINALIZADO
                return { color: 'danger', nombre: 'ANULADO' };

            default: //DEFAULT
                return { color: 'erroring', nombre: 'INDEFINIDO' };
        }
    }

    notification(message: Message) {
        this.messageService.add(message);
    }

    encrypted(data: string) {
        const iv = CryptoJS.lib.WordArray.random(16);
        const dataEncrypted = CryptoJS.AES.encrypt(
            data,
            CryptoJS.enc.Utf8.parse(cryptoKey),
            { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        );
        const encryptedData = iv
            .concat(dataEncrypted.ciphertext)
            .toString(CryptoJS.enc.Base64);
        return encryptedData;
    }

    decrypted(data: string) {
        const decryptData = CryptoJS.AES.decrypt(data, cryptoKey).toString(
            CryptoJS.enc.Utf8
        );
        return decryptData;
    }

    obtenerTiposDocumento() {
        this.http.get<[]>(`${url}/auth/tipos_documento`).subscribe({
            next: (data) => {
                this._tipos_documento.set(data);
            },
            error: (err) => {
                this._tipos_documento.set([]);
            },
        });
    }
}
