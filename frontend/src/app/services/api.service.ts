import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/token/`, credentials);
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/`);
  }

  getDispositivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dispositivos/`);
  }

  getSedes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sedes/`);
  }
}