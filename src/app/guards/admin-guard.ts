import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { filter, map, switchMap, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.loading$.pipe(
    filter(loading => !loading),
    take(1),
    switchMap(() => authService.authState$.pipe(take(1))),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }

      const role = authService.getUserRole();

      if (role !== 'ADMIN') {
        router.navigate(['/home']);
        return false;
      }

      return true;
    })
  );
};
