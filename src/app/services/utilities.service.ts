import { Injectable } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import * as CryptoJS from 'crypto-js';
import { cryptoKey } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UtilitiesService {
    constructor(private messageService: MessageService) {}

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
                return { color: 'warning', nombre: 'INDEFINIDO' };
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
            console.log({iv, cryptoKey});
            
        console.log({ cifrado: encryptedData, original: JSON.parse(data), parse: data });
        return encryptedData;
    }

    decrypted(data: string) {
        const decryptData = CryptoJS.AES.decrypt(data, cryptoKey).toString(
            CryptoJS.enc.Utf8
        );
        return decryptData;
    }
}
