import {
    Component,
    ElementRef,
    inject,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as QRCode from 'qrcode';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
    selector: 'app-tickt-turno',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './tickt-turno.component.html',
    styleUrl: './tickt-turno.component.scss',
})
export class TicktTurnoComponent implements OnInit {
    @Input() turno_in: any;
    @ViewChild('qrImage') qrImage: ElementRef;
    private utility = inject(UtilitiesService);

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit(): void {
        this.generarCodigoQR();
    }

    async generarCodigoQR() {
        try {
            const infoQR = {
                turno_id: this.utility.encrypted(`${this.turno_in.id}`),
                turno: this.turno_in.turno,
                servicio: this.turno_in.servicio,
                fecha: this.turno_in.fecha_creacion,
            };

            // Convertir a string JSON
            const infoQRString = JSON.stringify(infoQR);

            // Generar código QR
            const qrCodeDataUrl = await QRCode.toDataURL(infoQRString, {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                width: 200,
                margin: 2,
            });

            // Asignar al elemento img
            if (this.qrImage) {
                this.qrImage.nativeElement.src = qrCodeDataUrl;
            }
            // this.imprimirTicket();
        } catch (err) {
            console.error('Error generando QR:', err);
        }
    }

    imprimirTicket() {
        const printContents = document.getElementById('ticket-print').innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    }

    parsearQR(codigoQR: string) {
        try {
            return JSON.parse(codigoQR);
        } catch (error) {
            console.error('Error parseando QR:', error);
            return null;
        }
    }
}
