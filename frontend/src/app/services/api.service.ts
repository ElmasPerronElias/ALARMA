import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dispositivo {
  id: number;
  nombre: string;
  codigo_dispositivo: string;
  tipo: string;
  sede: string;
  sede_id: number;
  estado: string;
  ip_address: string;
  ultima_conexion: string;
  conectado: boolean;
}

export interface Sede {
  id: number;
  nombre: string;
  codigo: string;
  institucion: string;
  institucion_id: number;
  direccion: string;
  telefono: string;
}

export interface Institucion {
  id: number;
  nombre: string;
  ruc: string;
  telefono: string;
  email: string;
  direccion: string;
}

export interface Horario {
  id: number;
  nombre: string;
  tipo_evento: string;
  dia_semana: string;
  hora_inicio: string;
  duracion_segundos: number;
  horario_escolar: string;
}

export interface Activacion {
  id: number;
  dispositivo: string;
  dispositivo_id: number;
  fecha_programada: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  // Dispositivos
  getDispositivos(): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(`${this.apiUrl}/dispositivos/`);
  }

  // Sedes
  getSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.apiUrl}/sedes/`);
  }

  // Instituciones
  getInstituciones(): Observable<Institucion[]> {
    return this.http.get<Institucion[]>(`${this.apiUrl}/instituciones/`);
  }

  // Horarios/Eventos
  getHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/horarios/`);
  }

  // Activaciones
  getActivaciones(): Observable<Activacion[]> {
    return this.http.get<Activacion[]>(`${this.apiUrl}/activaciones/`);
  }

  // Activar timbre manualmente
  activarTimbre(dispositivoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/activar-timbre/`, { dispositivo_id: dispositivoId });
  }
}