import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AlmacenService } from '../services/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageService = inject(AlmacenService);
  let currentUser = storageService.obtenerDatosUsuario();
  let currentURL = storageService.obtenerRutaActual();

  if (currentUser) {
    // Si existe el token, permite el acceso
    return true;
  }

  // Si no hay token, redirige a la página de autenticación
  router.navigate(['/']);
  return false;
};
