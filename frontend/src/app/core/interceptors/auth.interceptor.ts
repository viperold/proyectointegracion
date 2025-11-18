// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // Si tu AuthService.getToken() devuelve una PROMESA (Firebase):
  const tokenPromise = auth.getToken?.(); // Promise<string | null> | string | null

  // Si es promesa, resolvemos y luego clonamos la request
  if (tokenPromise && typeof (tokenPromise as any).then === 'function') {
    return from(tokenPromise as Promise<string | null>).pipe(
      switchMap((token) => {
        const authReq = token
          ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
          : req;
        return next(authReq);
      })
    );
  }

  // Si NO es promesa (por ej. token del localStorage de backend)
   const token = (tokenPromise as unknown as string | null) ?? null;
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq);
};
