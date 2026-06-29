import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Noticia {
  titulo: string;
  imagen: string;
  fecha: string;
  contenido: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  private API = environment.apiNoticias;
  private cache = new Map<number, Noticia[]>();

  constructor(private http: HttpClient) {}

  obtenerNoticias(start: number, pagina: number): Observable<Noticia[]> {
    if (this.cache.has(pagina)) {
      return of(this.cache.get(pagina)!);
    }

    return this.http.get<Noticia[]>(`${this.API}/api/noticias?start=${start}`).pipe(
      tap(data => this.cache.set(pagina, data))
    );
  }

  obtenerDetalle(url: string): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.API}/api/noticia-detalle?url=${encodeURIComponent(url)}`);
  }
}
