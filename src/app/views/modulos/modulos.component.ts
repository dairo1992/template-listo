import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Modulo } from 'src/app/interfaces/modulo.interface';
import { Sede } from 'src/app/interfaces/sede.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ModuloService } from 'src/app/services/modulo.service';
import { SedesService } from 'src/app/services/sedes.service';
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
    listaSedesFilter: Sede[] = [];
    public getStatus = inject(UtilitiesService).getStatus;
    modalNuevaSede: boolean = false;
    modalTitle: string = 'REGISTRAR MODULO';
    moduloForm!: FormGroup;
    ngOnInit(): void {
        this.moduloForm = new FormGroup({
            id: new FormControl(Validators.required),
            sede_id: new FormControl([Validators.required]),
            empresa_id: new FormControl([Validators.required]),
            nombre: new FormControl(''),
            estado: new FormControl('A'),
            created_at: new FormControl(''),
            sede: new FormControl(''),
        });
    }

    nuevoModulo(): void {
        this.service.nuevoModulo(this.moduloForm.value);
        this.modalNuevaSede = false;
    }

    setModulo(sede: Modulo): void {
        this.listaSedesByEmpresa(sede.empresa_id);
        this.moduloForm.setValue(sede);
        this.modalTitle = `MODIFICAR ${sede.nombre}`;
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

    listaSedesByEmpresa(id_empresa: number) {
        this.listaSedesFilter = this._sedes_Service
            .lista_sedes()
            .filter((sede) => sede.empresa_id == id_empresa);
    }
}
