import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reporte } from '../models/reporte.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private api = environment.apiBackend + '/admin';
  private apiUrl = environment.apiBackend + '/api/reportes/todos';
  

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el historial de reportes de un agente por placa
   */
  obtenerReportesPorAgente(placa: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/${placa}/reportes`, {
      withCredentials: true,
    });
  }

  obtenerReportes() {
    return fetch(this.apiUrl).then((res) => res.json());
  }

}
