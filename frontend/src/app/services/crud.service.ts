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

// ========== CRUD SERVICE OPTIMIZADO ==========
@Injectable({ providedIn: 'root' })
export class CrudService {
  private apiUrl = environment.apiUrl;

  // Mapeo de endpoints
  private endpoints = {
    instituciones: '/instituciones/',
    sedes: '/sedes/',
    dispositivos: '/dispositivos/',
    horariosEscolares: '/horarios-escolares/',
    eventosHorario: '/eventos-horario/'
  };

  constructor(private http: HttpClient) {}

  // Método genérico para GET (todos)
  private getAll<T>(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}${endpoint}`);
  }

  // Método genérico para GET (uno)
  private getOne<T>(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}${id}/`);
  }

  // Método genérico para POST
  private create<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data);
  }

  // Método genérico para PUT
  private update<T>(endpoint: string, id: number, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}${id}/`, data);
  }

  // Método genérico para DELETE
  private delete(endpoint: string, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${endpoint}${id}/`);
  }

  // ========== INSTITUCIONES ==========
  getInstituciones = () => this.getAll<Institucion>(this.endpoints.instituciones);
  getInstitucion = (id: number) => this.getOne<Institucion>(this.endpoints.instituciones, id);
  createInstitucion = (data: Institucion) => this.create<Institucion>(this.endpoints.instituciones, data);
  updateInstitucion = (id: number, data: Institucion) => this.update<Institucion>(this.endpoints.instituciones, id, data);
  deleteInstitucion = (id: number) => this.delete(this.endpoints.instituciones, id);

  // ========== SEDES ==========
  getSedes = () => this.getAll<Sede>(this.endpoints.sedes);
  getSede = (id: number) => this.getOne<Sede>(this.endpoints.sedes, id);
  createSede = (data: Sede) => this.create<Sede>(this.endpoints.sedes, data);
  updateSede = (id: number, data: Sede) => this.update<Sede>(this.endpoints.sedes, id, data);
  deleteSede = (id: number) => this.delete(this.endpoints.sedes, id);

  // ========== DISPOSITIVOS ==========
  getDispositivos = () => this.getAll<Dispositivo>(this.endpoints.dispositivos);
  getDispositivo = (id: number) => this.getOne<Dispositivo>(this.endpoints.dispositivos, id);
  createDispositivo = (data: Dispositivo) => this.create<Dispositivo>(this.endpoints.dispositivos, data);
  updateDispositivo = (id: number, data: Dispositivo) => this.update<Dispositivo>(this.endpoints.dispositivos, id, data);
  deleteDispositivo = (id: number) => this.delete(this.endpoints.dispositivos, id);

  // ========== HORARIOS ESCOLARES ==========
  getHorariosEscolares = () => this.getAll<HorarioEscolar>(this.endpoints.horariosEscolares);
  getHorarioEscolar = (id: number) => this.getOne<HorarioEscolar>(this.endpoints.horariosEscolares, id);
  createHorarioEscolar = (data: HorarioEscolar) => this.create<HorarioEscolar>(this.endpoints.horariosEscolares, data);
  updateHorarioEscolar = (id: number, data: HorarioEscolar) => this.update<HorarioEscolar>(this.endpoints.horariosEscolares, id, data);
  deleteHorarioEscolar = (id: number) => this.delete(this.endpoints.horariosEscolares, id);

  // ========== EVENTOS HORARIO ==========
  getEventosHorario = () => this.getAll<EventoHorario>(this.endpoints.eventosHorario);
  getEventoHorario = (id: number) => this.getOne<EventoHorario>(this.endpoints.eventosHorario, id);
  createEventoHorario = (data: EventoHorario) => this.create<EventoHorario>(this.endpoints.eventosHorario, data);
  updateEventoHorario = (id: number, data: EventoHorario) => this.update<EventoHorario>(this.endpoints.eventosHorario, id, data);
  deleteEventoHorario = (id: number) => this.delete(this.endpoints.eventosHorario, id);
}