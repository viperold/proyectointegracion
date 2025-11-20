import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const estudianteGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userData = await authService.getCurrentUserData();

  if (userData?.role === 'estudiante') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
