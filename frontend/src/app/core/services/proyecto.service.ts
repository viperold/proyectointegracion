// Servicio de proyectos
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, ENDPOINTS } from '../constants/constants';
import { Proyecto, Colaboracion, Comentario } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private http = inject(HttpClient);

  getProyectos(filters?: any): Observable<any> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.append(key, filters[key]);
        }
      });
    }
    
    return this.http.get<any>(`${API_URL}${ENDPOINTS.PROYECTOS}`, { params });
  }

  getProyecto(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${API_URL}${ENDPOINTS.PROYECTOS}${id}/`);
  }

  createProyecto(data: FormData): Observable<Proyecto> {
    return this.http.post<Proyecto>(`${API_URL}${ENDPOINTS.PROYECTOS}`, data);
  }

  updateProyecto(id: number, data: FormData): Observable<Proyecto> {
    return this.http.put<Proyecto>(`${API_URL}${ENDPOINTS.PROYECTOS}${id}/`, data);
  }

  deleteProyecto(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}${ENDPOINTS.PROYECTOS}${id}/`);
  }

  getMisProyectos(): Observable<any> {
    return this.http.get<any>(`${API_URL}${ENDPOINTS.MIS_PROYECTOS}`);
  }

  getProyectosColaborando(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${API_URL}${ENDPOINTS.PROYECTOS_COLABORANDO}`);
  }

  solicitarColaboracion(proyectoId: number, mensaje: string): Observable<Colaboracion> {
    return this.http.post<Colaboracion>(
      `${API_URL}${ENDPOINTS.PROYECTOS}${proyectoId}/solicitar_colaboracion/`,
      { mensaje }
    );
  }

  getColaboradores(proyectoId: number): Observable<Colaboracion[]> {
    return this.http.get<Colaboracion[]>(
      `${API_URL}${ENDPOINTS.PROYECTOS}${proyectoId}/colaboradores/`
    );
  }

  getSolicitudes(proyectoId: number): Observable<Colaboracion[]> {
    return this.http.get<Colaboracion[]>(
      `${API_URL}${ENDPOINTS.PROYECTOS}${proyectoId}/solicitudes/`
    );
  }

  aceptarColaboracion(colaboracionId: number, respuesta?: string): Observable<Colaboracion> {
    return this.http.post<Colaboracion>(
      `${API_URL}${ENDPOINTS.COLABORACIONES}${colaboracionId}/aceptar/`,
      { respuesta }
    );
  }

  rechazarColaboracion(colaboracionId: number, respuesta?: string): Observable<Colaboracion> {
    return this.http.post<Colaboracion>(
      `${API_URL}${ENDPOINTS.COLABORACIONES}${colaboracionId}/rechazar/`,
      { respuesta }
    );
  }

  getComentarios(proyectoId: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(
      `${API_URL}${ENDPOINTS.COMENTARIOS}?proyecto=${proyectoId}`
    );
  }

  createComentario(proyectoId: number, contenido: string): Observable<Comentario> {
    return this.http.post<Comentario>(`${API_URL}${ENDPOINTS.COMENTARIOS}`, {
      proyecto: proyectoId,
      contenido
    });
  }

  deleteComentario(comentarioId: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}${ENDPOINTS.COMENTARIOS}${comentarioId}/`);
  }
}
