import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(err => {
      // /api/auth/me devuelve 401 cuando no hay sesión — es comportamiento esperado,
      // no redirigir (el authGuard ya maneja el acceso a rutas protegidas)
      const isSessionCheck = req.url.includes('/api/auth/me');
      if (err.status === 401 && !isSessionCheck) {
        router.navigate(['/login']);
      } else if (err.status === 403) {
        router.navigate(['/home']);
      }
      return throwError(() => err);
    })
  );
};
