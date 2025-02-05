import { Component, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { AuthService } from 'src/app/services/authservice.service';
import { EmpresaService } from 'src/app/services/empresa.service';
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
    formAuth: FormGroup;
    public storageService = inject(AlmacenService);
    public authService = inject(AuthService);
    public empresaService = inject(EmpresaService);
    constructor() {
        this.obtenerEmpresas(0);
        this.formAuth = new FormGroup({
            EMPRESA: new FormControl(0),
            USUARIO: new FormControl(0),
            PASSWORD: new FormControl('', [Validators.required]),
            RECORDAR: new FormControl(false),
        });
    }

    ngOnInit(): void {
        const usuario = this.storageService.obtenerUsuario();
        // const token = this.storageService.obtenerToken();
        if (usuario.usuario != null && usuario.password != null) {
            this.formAuth.patchValue({
                USUARIO: parseInt(usuario.usuario),
                PASSWORD: usuario.password,
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

    // recordar(): void {
    //     const status = this.formAuth.value.RECORDAR;
    //     if (status) {
    //         this.storageService.recordarUsuario(this.formAuth.value);
    //     } else {
    //         this.storageService.olvidarUsuario();
    //     }
    // }

    obtenerEmpresas(id_usuario: number): void {
        this.empresaService.obtenerEmpresas(0).subscribe({
            next: (empresas) => {
                this.empresaService._lista_empresas.set(empresas);
            },
            error: (err) => {
                this.empresaService._lista_empresas.set([]);
            }
        });
    }
}
