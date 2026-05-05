import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ========== INTERFACES ==========
export interface Institucion {
  id?: number;
  nombre: string;
  ruc?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  logo?: string;
  activo: boolean;
}

export interface Sede {
  id?: number;
  institucion: number;
  institucion_nombre?: string;
  nombre: string;
  codigo: string;
  direccion: string;
  telefono?: string;
  latitud?: number;
  longitud?: number;
  zona_horaria?: string;
  activo: boolean;
}

export interface Dispositivo {
  id?: number;
  sede: number;
  sede_nombre?: string;
  nombre: string;
  codigo_dispositivo: string;
  tipo: string;
  estado?: number;
  ip_address?: string;
  firmware_version?: string;
  activo: boolean;
}

export interface HorarioEscolar {
  id?: number;
  sede: number;
  sede_nombre?: string;
  nombre: string;
  tipo_jornada: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  descripcion?: string;
}

export interface EventoHorario {
  id?: number;
  horario_escolar: number;
  horario_nombre?: string;
  nombre: string;
  tipo_evento: string;
  dia_semana: string;
  hora_inicio: string;
  hora_fin?: string;
  duracion_segundos: number;
  activo: boolean;
  orden: number;
}

// ========== CRUD SERVICE ==========
@Injectable({ providedIn: 'root' })
export class CrudService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ========== INSTITUCIONES ==========
  getInstituciones(): Observable<Institucion[]> {
    return this.http.get<Institucion[]>(`${this.apiUrl}/instituciones/`);
  }

  getInstitucion(id: number): Observable<Institucion> {
    return this.http.get<Institucion>(`${this.apiUrl}/instituciones/${id}/`);
  }

  createInstitucion(data: Institucion): Observable<Institucion> {
    return this.http.post<Institucion>(`${this.apiUrl}/instituciones/`, data);
  }

  updateInstitucion(id: number, data: Institucion): Observable<Institucion> {
    return this.http.put<Institucion>(`${this.apiUrl}/instituciones/${id}/`, data);
  }

  deleteInstitucion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/instituciones/${id}/`);
  }

  // ========== SEDES ==========
  getSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.apiUrl}/sedes/`);
  }

  getSede(id: number): Observable<Sede> {
    return this.http.get<Sede>(`${this.apiUrl}/sedes/${id}/`);
  }

  createSede(data: Sede): Observable<Sede> {
    return this.http.post<Sede>(`${this.apiUrl}/sedes/`, data);
  }

  updateSede(id: number, data: Sede): Observable<Sede> {
    return this.http.put<Sede>(`${this.apiUrl}/sedes/${id}/`, data);
  }

  deleteSede(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sedes/${id}/`);
  }

  // ========== DISPOSITIVOS ==========
  getDispositivos(): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(`${this.apiUrl}/dispositivos/`);
  }

  getDispositivo(id: number): Observable<Dispositivo> {
    return this.http.get<Dispositivo>(`${this.apiUrl}/dispositivos/${id}/`);
  }

  createDispositivo(data: Dispositivo): Observable<Dispositivo> {
    return this.http.post<Dispositivo>(`${this.apiUrl}/dispositivos/`, data);
  }

  updateDispositivo(id: number, data: Dispositivo): Observable<Dispositivo> {
    return this.http.put<Dispositivo>(`${this.apiUrl}/dispositivos/${id}/`, data);
  }

  deleteDispositivo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/dispositivos/${id}/`);
  }

  // ========== HORARIOS ESCOLARES ==========
  getHorariosEscolares(): Observable<HorarioEscolar[]> {
    return this.http.get<HorarioEscolar[]>(`${this.apiUrl}/horarios-escolares/`);
  }

  getHorarioEscolar(id: number): Observable<HorarioEscolar> {
    return this.http.get<HorarioEscolar>(`${this.apiUrl}/horarios-escolares/${id}/`);
  }

  createHorarioEscolar(data: HorarioEscolar): Observable<HorarioEscolar> {
    return this.http.post<HorarioEscolar>(`${this.apiUrl}/horarios-escolares/`, data);
  }

  updateHorarioEscolar(id: number, data: HorarioEscolar): Observable<HorarioEscolar> {
    return this.http.put<HorarioEscolar>(`${this.apiUrl}/horarios-escolares/${id}/`, data);
  }

  deleteHorarioEscolar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/horarios-escolares/${id}/`);
  }

  // ========== EVENTOS HORARIO ==========
  getEventosHorario(): Observable<EventoHorario[]> {
    return this.http.get<EventoHorario[]>(`${this.apiUrl}/eventos-horario/`);
  }

  getEventoHorario(id: number): Observable<EventoHorario> {
    return this.http.get<EventoHorario>(`${this.apiUrl}/eventos-horario/${id}/`);
  }

  createEventoHorario(data: EventoHorario): Observable<EventoHorario> {
    return this.http.post<EventoHorario>(`${this.apiUrl}/eventos-horario/`, data);
  }

  updateEventoHorario(id: number, data: EventoHorario): Observable<EventoHorario> {
    return this.http.put<EventoHorario>(`${this.apiUrl}/eventos-horario/${id}/`, data);
  }

  deleteEventoHorario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eventos-horario/${id}/`);
  }
}