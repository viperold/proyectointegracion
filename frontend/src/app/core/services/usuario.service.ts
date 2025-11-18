// Servicio de usuarios
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL, ENDPOINTS } from '../constants/constants';
import { Usuario, Habilidad, Disciplina } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<any>(`${API_URL}${ENDPOINTS.USUARIOS}`).pipe(
      map(response => Array.isArray(response) ? response : response.results || [])
    );
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${API_URL}${ENDPOINTS.USUARIOS}${id}/`);
  }

  getHabilidades(): Observable<Habilidad[]> {
    return this.http.get<any>(`${API_URL}${ENDPOINTS.HABILIDADES}`).pipe(
      map(response => Array.isArray(response) ? response : response.results || [])
    );
  }

  getDisciplinas(): Observable<Disciplina[]> {
    return this.http.get<any>(`${API_URL}${ENDPOINTS.DISCIPLINAS}`).pipe(
      map(response => Array.isArray(response) ? response : response.results || [])
    );
  }

  createHabilidad(data: { nombre: string; descripcion?: string }): Observable<Habilidad> {
    return this.http.post<Habilidad>(`${API_URL}${ENDPOINTS.HABILIDADES}`, data);
  }

  createDisciplina(data: { nombre: string; descripcion?: string }): Observable<Disciplina> {
    return this.http.post<Disciplina>(`${API_URL}${ENDPOINTS.DISCIPLINAS}`, data);
  }
}
