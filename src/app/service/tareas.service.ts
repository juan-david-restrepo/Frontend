import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private apiUrl = environment.apiBackend + '/admin';

  constructor(private http: HttpClient) {}

  obtenerTareasPorAgente(placa: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${placa}`, { withCredentials: true });
  }

  asignarTarea(placa: string, tarea: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${placa}/tareas`, tarea, { withCredentials: true, responseType: 'text' });
  }

  eliminarTarea(idTarea: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tareas/${idTarea}`, { withCredentials: true });
  }
}