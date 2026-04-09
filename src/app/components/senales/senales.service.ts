import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Senal {
  tipo: string;
  nombre: string;
  descripcion: string;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class SenalesService {

  private API = environment.apiSenales;

  constructor(private http: HttpClient) {}

  obtenerSenales(): Observable<Senal[]> {
    return this.http.get<Senal[]>(`${this.API}/api/senales`);
  }
}