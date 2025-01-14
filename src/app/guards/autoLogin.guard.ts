import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AlmacenService } from '../services/storage.service';

export const autoLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageService = inject(AlmacenService);
  let currentUser = storageService.obtenerDatosUsuario();
  if (currentUser) {
    // Si hay token, redirige automáticamente a home
    router.navigate(['/home']);
    return false;
  }

  // Si no hay token, permite acceder a la página de login
  return true;
};
