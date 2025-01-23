import { ChangeDetectorRef, Component, computed, inject, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { AlertaSwal } from 'src/app/components/swal-alert';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { PantallaAdminService } from 'src/app/services/pantalla-admin.service';
import { SocketService } from 'src/app/services/socket.service';
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
  modalPauta: boolean = false;
  nuevaPauta = "";
  pautaActual: any;


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
  private socketService = inject(SocketService);
  displayCustom: boolean | undefined;

  activeIndex: number = 0;
  private alert: AlertaSwal;
  constructor(private cdr: ChangeDetectorRef) {
    this.alert = new AlertaSwal();
  }

  ngOnInit(): void {
    const empresa_id = this.usuarioService._currentUser().empresa.id;
    this.obtenerImagenes(empresa_id);
    this.obtenerPauta(empresa_id);
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
    this.service.cargarImagenes(id_empresa != null ? id_empresa : 0, files).subscribe({
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
    this.service.obtenerImagenes(id_empresa != null ? id_empresa : 0).subscribe({
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

  agregarPauta() {
    const currentUser = this.usuarioService._currentUser();
    const mensajeNuevo = this.nuevaPauta;
    this.service.nuevaPauta({ pauta: this.nuevaPauta, id_empresa: currentUser.empresa.id != null ? currentUser.empresa.id : 0 }).subscribe({
      next: async (resp: any) => {
        this.modalPauta = false;
        this.nuevaPauta = "";
        this.alert.showMessage({
          position: "center",
          icon: resp.STATUS ? "success" : "error",
          title: "!NOTIFICACION¡",
          text: resp.MSG,
          showConfirmButton: true,
        });
        if (resp.STATUS) {
          await this.socketService.emit('mensaje', { "empresa_id": currentUser.empresa.id, "sede_id": currentUser.empresa.sede.id, "usuario_id": currentUser.id });
          this.pautaActual = mensajeNuevo;
        }
      },
      error: (err) => {
        this.modalPauta = false;
        this.alert.showMessage({
          position: "center",
          icon: "error",
          title: "!NOTIFICACION¡",
          text: err.error,
          showConfirmButton: true,
        });
      },
    });
  }

  obtenerPauta(empresa_id: number) {
    this.service.obtenerPauta(empresa_id != null ? empresa_id : 0).subscribe((data: any) => this.pautaActual = data.pauta);
  }
}