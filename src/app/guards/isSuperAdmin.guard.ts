import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import Swal from 'sweetalert2';

export const isSuperAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const currentUser = inject(UsuarioService).currentUser();

  if (currentUser.tipo_usuario === 'SUPER_ADMIN') {
    return true;
  } else {
    // Swal.fire({
    //   position: "center",
    //   icon: "info",
    //   title: "!NOTIFICACION¡",
    //   text: "NO CUENTA CON PERMISOS PARA ACCEDER A ESTE MODULO",
    //   showConfirmButton: true,
    //   allowEnterKey: false,
    //   allowOutsideClick: false
    // }).then((result) => {
    //   router.navigateByUrl('/');
    // });
    router.navigateByUrl('/');
    return false;
  }
};
