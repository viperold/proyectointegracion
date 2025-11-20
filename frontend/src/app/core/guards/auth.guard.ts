import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const current = auth.currentUser;

  if (current) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
