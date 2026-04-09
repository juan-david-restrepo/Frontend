import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  private API = environment.apiNoticias;

  constructor(private http: HttpClient) {}

  obtenerNoticias(start: number) {
    return this.http.get<any[]>(`${this.API}/api/noticias?start=${start}`);
  }

  obtenerDetalle(url: string) {
    return this.http.get<any>(`${this.API}/api/noticia-detalle?url=${encodeURIComponent(url)}`);
  }
}

