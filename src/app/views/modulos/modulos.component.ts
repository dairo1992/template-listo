import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Modulo } from 'src/app/interfaces/modulo.interface';
import { Sede } from 'src/app/interfaces/sede.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ModuloService } from 'src/app/services/modulo.service';
import { SedesService } from 'src/app/services/sedes.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
    selector: 'app-modulos',
    standalone: true,
    imports: [PrimeModule],
    templateUrl: './modulos.component.html',
    styleUrl: './modulos.component.scss',
})
export default class ModulosComponent {
    public service = inject(ModuloService);
    private _sedes_Service = inject(SedesService);
    public listaEmpresas = inject(EmpresaService).lista_empresas;
    private usuarioService = inject(UsuarioService);
    listaSedesFilter: Sede[] = [];
    public getStatus = inject(UtilitiesService).getStatus;
    modalNuevaSede: boolean = false;
    modalTitle: string = 'REGISTRAR MODULO';
    moduloForm!: FormGroup;

    constructor() {
        this.service.obtenerModulos(this.usuarioService.currentUser().id);
        this._sedes_Service.obtenerSedes(this.usuarioService.currentUser().id);
    }
    ngOnInit(): void {
        this.moduloForm = new FormGroup({
            id: new FormControl(Validators.required),
            nombre: new FormControl(''),
            estado: new FormControl('A'),
            created_at: new FormControl(''),
            sede: new FormControl(''),
            sede_id: new FormControl([Validators.required]),
        });
    }

    nuevoModulo(): void {
        this.service.nuevoModulo(this.moduloForm.value);
        this.modalNuevaSede = false;
    }

    setModulo(modulo: Modulo): void {
        this.listaSedesByEmpresa('E');
        this.moduloForm.setValue(modulo);
        this.modalTitle = `MODIFICAR ${modulo.nombre}`;
        this.modalNuevaSede = true;
    }

    actualizarModulo(sede: Modulo): void {
        this.service.actualizarModulo(sede.id, sede);
        this.modalNuevaSede = false;
    }

    uiEstado(sede: Modulo): void {
        this.service.uiEstado(sede);
    }

    close(): void {
        this.moduloForm.reset({
            id: '',
            empresa_id: '',
            nombre: '',
            direccion: '',
            estado: '',
            created_at: '',
            empresa: '',
        });
    }

    listaSedesByEmpresa(accion: string = 'N') {
        const usuario = this.usuarioService.currentUser();
        this.listaSedesFilter = this._sedes_Service
            .lista_sedes()
            .filter((sede) => {
                if (accion === 'N' && usuario.tipo_usuario === 'SUPER_ADMIN') {
                    return sede;
                } else {
                    if (sede.empresa_id == usuario.empresa.id) {
                        return sede;
                    }
                    return null;
                }
            });
    }
}
