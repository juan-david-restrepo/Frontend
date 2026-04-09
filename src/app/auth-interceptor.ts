import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('http')) {
    req = req.clone({
      url: environment.apiBackend + req.url
    });
  }

  return next(req.clone({
    withCredentials: true
  }));
};
