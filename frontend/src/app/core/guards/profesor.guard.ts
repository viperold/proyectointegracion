import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const profesorGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userData = await authService.getCurrentUserData();

  if (userData?.role === 'profesor' || userData?.role === 'administrador') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
