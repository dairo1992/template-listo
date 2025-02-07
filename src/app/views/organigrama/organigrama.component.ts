import { Component, inject, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AlertaSwal } from 'src/app/components/swal-alert';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { PrimeModule } from 'src/app/layout/prime-module/prime-module.module';
import { AuthService } from 'src/app/services/authservice.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-organigrama',
  standalone: true,
  imports: [PrimeModule],
  templateUrl: './organigrama.component.html',
  styleUrl: './organigrama.component.scss'
})
export default class OrganigramaComponent implements OnInit {
  private authService = inject(AuthService);
  private usuService = inject(UsuarioService);
  loading: boolean = true;
  currentUser: Usuario;
  organigrama = [];
  private alert: AlertaSwal = new AlertaSwal();
  constructor() {
    this.currentUser = this.usuService.currentUser();
  }
  ngOnInit(): void {
    this.authService.obtenerOrganigrama(this.currentUser.empresa.id).subscribe({
      next: (resp: any) => {
        this.organigrama = resp;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.alert.showMessage({
          position: "center",
          icon: "error",
          title: "!NOTIFICACION¡",
          text: err.error,
          showConfirmButton: true,
        });
      }
    })
  }
}
