import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // ← Agregar
import { environment } from '../environments/environment local'; // ← Agregar

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

  constructor(private router: Router, private http: HttpClient) { // ← Agregar http
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.hideNav = url === '/login' || url === '/registro';
      
      // 🔥 Hacer ping al backend para mantenerlo activo
      if (url !== '/login' && url !== '/registro') {
        this.http.get(`${environment.apiUrl}/dashboard/`).subscribe();
      }
    });
  }
}