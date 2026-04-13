import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { catchError, of } from 'rxjs';



export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    map(() => {
      const role = authService.getUserRole();
      
      const currentPath = window.location.pathname;
      const agenteRoutes = ['/tareas', '/historial', '/reportes', '/dashboard', '/perfil-agente', '/agente'];
      const adminRoutes = ['/admin', '/gestion-agentes', '/gestion-soporte', '/config-admin'];
      
      if (role === 'CIUDADANO') {
        if (agenteRoutes.some(r => currentPath.startsWith(r)) || adminRoutes.some(r => currentPath.startsWith(r))) {
          router.navigate(['/home']);
          return false;
        }
      }
      
      return true;
    }),

    catchError(() => {
      authService.setAuthenticated(false);
      router.navigate(['/login']);
      return of(false);
    }),
  );
};