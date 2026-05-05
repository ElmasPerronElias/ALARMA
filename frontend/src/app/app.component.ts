import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'; // ← CORREGIDO (sin "local")

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  hideNav = false;

  constructor(private router: Router, private http: HttpClient) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.hideNav = url === '/login' || url === '/registro';
      
      // Hacer ping al backend para mantenerlo activo
      if (url !== '/login' && url !== '/registro') {
        this.http.get(`${environment.apiUrl}/dashboard/`).subscribe({
          next: () => console.log('Ping exitoso'),
          error: (err) => console.error('Ping fallido:', err)
        });
      }
    });
  }
}