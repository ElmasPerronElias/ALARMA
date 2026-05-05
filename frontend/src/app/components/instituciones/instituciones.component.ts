// instituciones.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrudService, Institucion } from '../../services/crud.service';

@Component({
  selector: 'app-instituciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 2rem;">
      <h1>🏛️ Instituciones</h1>
      
      <!-- Formulario -->
      <div style="background: #f0f2f5; padding: 1rem; margin-bottom: 2rem;">
        <h3>{{ editando ? 'Editar' : 'Nueva' }} Institución</h3>
        <input [(ngModel)]="formData.nombre" placeholder="Nombre" style="margin-right: 10px;">
        <input [(ngModel)]="formData.ruc" placeholder="RUC" style="margin-right: 10px;">
        <input [(ngModel)]="formData.telefono" placeholder="Teléfono" style="margin-right: 10px;">
        <input [(ngModel)]="formData.email" placeholder="Email" style="margin-right: 10px;">
        <textarea [(ngModel)]="formData.direccion" placeholder="Dirección"></textarea>
        <label><input type="checkbox" [(ngModel)]="formData.activo"> Activo</label>
        <button (click)="guardar()">{{ editando ? 'Actualizar' : 'Crear' }}</button>
        <button *ngIf="editando" (click)="cancelarEdicion()">Cancelar</button>
      </div>
      
      <!-- Lista -->
      <table style="width: 100%; border-collapse: collapse;">
        <thead><tr><th>ID</th><th>Nombre</th><th>RUC</th><th>Teléfono</th><th>Email</th><th>Activo</th><th>Acciones</th></tr></thead>
        <tbody>
          <tr *ngFor="let item of items">
            <td>{{ item.id }}</td><td>{{ item.nombre }}</td><td>{{ item.ruc }}</td>
            <td>{{ item.telefono }}</td><td>{{ item.email }}</td><td>{{ item.activo ? '✅' : '❌' }}</td>
            <td><button (click)="editar(item)">✏️</button> <button (click)="eliminar(item.id!)">🗑️</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class InstitucionesComponent implements OnInit {
  items: Institucion[] = [];
  formData: Institucion = { nombre: '', activo: true };
  editando = false;

  constructor(private crud: CrudService) {}

  ngOnInit() { this.cargar(); }

  cargar() { this.crud.getInstituciones().subscribe(data => this.items = data); }

  guardar() {
    if (this.editando) {
      this.crud.updateInstitucion(this.formData.id!, this.formData).subscribe(() => this.cargar());
    } else {
      this.crud.createInstitucion(this.formData).subscribe(() => this.cargar());
    }
    this.limpiarForm();
  }

  editar(item: Institucion) { this.formData = { ...item }; this.editando = true; }
  
  eliminar(id: number) { if (confirm('¿Eliminar?')) this.crud.deleteInstitucion(id).subscribe(() => this.cargar()); }
  
  cancelarEdicion() { this.limpiarForm(); }
  
  limpiarForm() { this.formData = { nombre: '', activo: true }; this.editando = false; }
}