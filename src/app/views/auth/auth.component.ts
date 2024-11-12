import { Component, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { AlmacenService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './auth.component.html',
    styles: `
    .container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
    `,
})
export default class AuthComponent implements OnInit {
    loading: boolean = false;
    formAuth: FormGroup;
    public storageService = inject(AlmacenService);
    private authService = inject(AuthserviceService);
    constructor() {
        this.formAuth = new FormGroup({
            USUARIO: new FormControl(''),
            PASSWORD: new FormControl('', [Validators.required]),
            RECORDAR: new FormControl(false),
        });
    }

    ngOnInit(): void {
        const usuario = this.storageService.obtenerUsuario();
        // const token = this.storageService.obtenerToken();
        if (usuario) {
            this.formAuth.patchValue({
                USUARIO: parseInt(usuario),
                RECORDAR: true,
            });
        }
        // if (token != null) {
        //   this.router.navigateByUrl('/dashboard');
        // }
    }

    login() {
        this.authService.login(this.formAuth.value);
    }

    recordar(): void {
        const status = this.formAuth.value.RECORDAR;
        if (status) {
            this.storageService.recordarUsuario(this.formAuth.value.USUARIO);
        } else {
            this.storageService.olvidarUsuario();
        }
    }
}
