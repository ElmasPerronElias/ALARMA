import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InstitucionesComponent } from './components/instituciones/instituciones.component';
import { SedesComponent } from './components/sedes/sedes.component';
import { DispositivosComponent } from './components/dispositivos/dispositivos.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { LoginComponent } from './components/login_y_registrar/login.component';
import { RegistroComponent } from './components/login_y_registrar/registro.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'instituciones', component: InstitucionesComponent },
  { path: 'sedes', component: SedesComponent },
  { path: 'dispositivos', component: DispositivosComponent },
  { path: 'horarios', component: HorariosComponent },
];