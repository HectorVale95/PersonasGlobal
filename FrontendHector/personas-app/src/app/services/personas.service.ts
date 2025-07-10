import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../shared/persona.model';
import { map } from 'rxjs/operators';

interface BackendPersona {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  direccion: string;
  telefono: string;
}

@Injectable({ providedIn: 'root' })
export class PersonasService {
  private apiUrl = 'http://localhost:3000/api/personas';

  constructor(private http: HttpClient) {}

  private mapBackendToFrontend(backendPersona: BackendPersona): Persona {
    return {
      id: backendPersona.id,
      nombres: backendPersona.nombre,
      apellidoPaterno: backendPersona.apellido_paterno,
      apellidoMaterno: backendPersona.apellido_materno,
      direccion: backendPersona.direccion,
      telefono: backendPersona.telefono
    };
  }

  private mapFrontendToBackend(persona: Omit<Persona, 'id'>): Omit<BackendPersona, 'id'> {
    return {
      nombre: persona.nombres,
      apellido_paterno: persona.apellidoPaterno,
      apellido_materno: persona.apellidoMaterno,
      direccion: persona.direccion,
      telefono: persona.telefono
    };
  }

  getPersonas(search = '', page = 1, pageSize = 10): Observable<{ data: Persona[]; total: number }> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', pageSize);

    let url = this.apiUrl;

    if (search && search.trim() !== '') {
      url = this.apiUrl + '/search';
      params = params.set('search', search);
    }
    
    return this.http.get<any>(url, { params })
      .pipe(
        map(response => ({
          data: response.data.map((p: any) => this.mapBackendToFrontend(p)),
          total: response.pagination.totalItems
        }))
      );
  }

  addPersona(persona: Omit<Persona, 'id'>): Observable<Persona> {
    const backendPersona = this.mapFrontendToBackend(persona);
    
    return this.http.post<BackendPersona>(this.apiUrl, backendPersona)
      .pipe(
        map(backendResponse => this.mapBackendToFrontend(backendResponse))
      );
  }

  updatePersona(id: number, persona: Omit<Persona, 'id'>): Observable<Persona> {
    const backendPersona = this.mapFrontendToBackend(persona);
    
    return this.http.put<BackendPersona>(`${this.apiUrl}/${id}`, backendPersona)
      .pipe(
        map(backendResponse => this.mapBackendToFrontend(backendResponse))
      );
  }

  deletePersona(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 