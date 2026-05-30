import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Agente } from '../models/agente.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = environment.apiBackend + '/admin/agentes';

  constructor(private http: HttpClient) {}

  // ===============================
  // OBTENER TODOS
  // ===============================
  obtenerAgentes(): Observable<Agente[]> {
    return this.http.get<Agente[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  // ===============================
  // BUSCAR POR PLACA
  // ===============================
  obtenerAgentePorPlaca(placa: string): Observable<Agente> {
    const normalizada = (placa ?? '').trim().toUpperCase();
    return this.http.get<Agente>(
      `${this.apiUrl}/${encodeURIComponent(normalizada)}`,
      { withCredentials: true }
    );
  }

  actualizarEstado(
    placa: string,
    estado: 'DISPONIBLE' | 'OCUPADO' | 'FUERA_SERVICIO'
  ): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${placa}`,
      { estado },
      { withCredentials: true }
    );
  }

  desactivarAgente(id: number): Observable<any> {
    return this.http.put(`${environment.apiBackend}/admin/agentes/${id}/desactivar`, {}, { withCredentials: true });
  }

  activarAgente(id: number): Observable<any> {
    return this.http.put(`${environment.apiBackend}/admin/agentes/${id}/activar`, {}, { withCredentials: true });
  }

  crearAgente(datos: {
    correo: string;
    password: string;
    nombreCompleto: string;
    tipoDocumento: string;
    numeroDocumento: string;
    placa: string;
    telefono: string;
    nombre?: string;
    documento?: string;
  }): Observable<any> {
    return this.http.post(`${environment.apiBackend}/admin/agentes/crear`, datos, {
      withCredentials: true
    });
  }
}