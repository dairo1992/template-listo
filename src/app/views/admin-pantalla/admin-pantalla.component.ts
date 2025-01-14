import { ChangeDetectorRef, Component, computed, inject, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { PantallaAdminService } from 'src/app/services/pantalla-admin.service';
import { UsuarioService } from 'src/app/services/usuario.service';

interface UploadedFile {
  name: string;
  objectURL: string;
  file: File;
}

@Component({
  selector: 'app-admin-pantalla',
  standalone: true,
  imports: [PrimeModule],
  templateUrl: './admin-pantalla.component.html',
  styleUrl: './admin-pantalla.component.scss',
  encapsulation: ViewEncapsulation.None // Importante para que los estilos se apliquen correctamente
})
export default class ArchivoComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  files: UploadedFile[] = [];
  imagenes: any[] = [];

  responsiveOptions = [
    {
      breakpoint: '1300px',
      numVisible: 4
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ];
  usuarioService = inject(UsuarioService);
  service = inject(PantallaAdminService);
  displayCustom: boolean | undefined;

  activeIndex: number = 0;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.obtenerImagenes(this.usuarioService._currentUser().empresa.id);
  }

  vistaPrevia(event: any): void {
    for (const file of event.files) {
      const objectURL = URL.createObjectURL(file);
      this.files.push({
        name: file.name,
        objectURL: objectURL,
        file: file
      });
    }
  }

  removeFile(file: UploadedFile): void {
    const index = this.files.indexOf(file);
    if (index > -1) {
      URL.revokeObjectURL(file.objectURL);
      this.files.splice(index, 1);
    }
  }

  cargarArchivos(event: any) {
    const files = event.files;
    const id_empresa = this.usuarioService._currentUser().empresa.id;
    this.service.cargarImagenes(id_empresa, files).subscribe({
      next: (resp) => {
        this.fileUpload.clear();
        this.files = [];
        this.obtenerImagenes(id_empresa);
      },
      error: (err) => {
        console.error(err)
      },
    });
  }

  obtenerImagenes(id_empresa: number) {
    this.imagenes = [];
    this.service.obtenerImagenes(id_empresa).subscribe({
      next: (resp: any[]) => {
        if (resp.length > 0) {
          this.imagenes = resp.map(item => ({
            itemImageSrc: `http://localhost/api-digiturno/uploads/${id_empresa}/${item}`,
            thumbnailImageSrc: `http://localhost/api-digiturno/uploads/${id_empresa}/${item}`,
            alt: item.nombreArchivo,
            title: item.nombreArchivo
          }));
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }
}