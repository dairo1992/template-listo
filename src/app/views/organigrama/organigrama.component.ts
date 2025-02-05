import { Component, inject, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
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
  currentUser: Usuario;
  organigrama = [];
  constructor() {
    this.currentUser = this.usuService.currentUser();
  }
  ngOnInit(): void {
    this.authService.obtenerOrganigrama(this.currentUser.empresa.id).subscribe({
      next: (resp: any) => {
        this.organigrama = resp;

      }
    })
  }
  data: TreeNode[] = [
    {
      expanded: true,
      type: 'person',
      styleClass: '!bg-indigo-100 !text-indigo-900 rounded-xl',
      data: {
        image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
        name: 'Amy Elsner',
        title: 'CEO',
      },
      children: [
        {
          expanded: true,
          type: 'person',
          styleClass: 'bg-purple-100 text-purple-900 rounded-xl',
          data: {
            image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png',
            name: 'Anna Fali',
            title: 'CMO',
          },
          children: [
            {
              label: 'Sales',
              styleClass: '!bg-purple-100 !text-purple-900 rounded-xl',
            },
            {
              label: 'Marketing',
              styleClass: '!bg-purple-100 !text-purple-900 rounded-xl',
            },
          ],
        },
        {
          expanded: true,
          type: 'person',
          styleClass: '!bg-teal-100 !text-teal-900 rounded-xl',
          data: {
            image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/stephenshaw.png',
            name: 'Stephen Shaw',
            title: 'CTO',
          },
          children: [
            {
              label: 'Development',
              styleClass: 'bg-teal-100 text-teal-900 rounded-xl',
            },
            {
              label: 'UI/UX Design',
              styleClass: '!bg-teal-100 !text-teal-900 rounded-xl',
            },
          ],
        },
      ],
    },
  ];
}
