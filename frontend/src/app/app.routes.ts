import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DispositivosComponent } from './components/dispositivos/dispositivos.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { SedesComponent } from './components/sedes/sedes.component';
import { InstitucionesComponent } from './components/instituciones/instituciones.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dispositivos', component: DispositivosComponent },
  { path: 'horarios', component: HorariosComponent },
  { path: 'sedes', component: SedesComponent },
  { path: 'instituciones', component: InstitucionesComponent },
];