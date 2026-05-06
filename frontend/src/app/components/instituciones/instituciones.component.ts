import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrudService, Institucion } from '../../services/crud.service';

@Component({
  selector: 'app-instituciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.css']
})
export class InstitucionesComponent implements OnInit {
  instituciones: Institucion[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  showModal: boolean = false;
  editando: boolean = false;
  formData: Institucion = { nombre: '', activo: true };

  constructor(private crudService: CrudService) {}

  ngOnInit() {
    this.cargarInstituciones();
  }

  cargarInstituciones() {
    this.isLoading = true;
    this.crudService.getInstituciones().subscribe({
      next: (data: Institucion[]) => {
        this.instituciones = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  get institucionesFiltradas(): Institucion[] {
    if (!this.searchTerm) return this.instituciones;
    const term = this.searchTerm.toLowerCase();
    return this.instituciones.filter(item => 
      item.nombre.toLowerCase().includes(term) || 
      (item.ruc && item.ruc.includes(term))
    );
  }

  abrirModal(editar: boolean = false, item?: Institucion) {
    this.editando = editar;
    this.showModal = true;
    if (editar && item) {
      this.formData = { ...item };
    } else {
      this.formData = { nombre: '', activo: true };
    }
  }

  cerrarModal() {
    this.showModal = false;
  }

  guardar() {
    if (!this.formData.nombre) {
      alert('El nombre es obligatorio');
      return;
    }

    if (this.editando) {
      this.crudService.updateInstitucion(this.formData.id!, this.formData).subscribe({
        next: () => {
          this.cargarInstituciones();
          this.cerrarModal();
        }
      });
    } else {
      this.crudService.createInstitucion(this.formData).subscribe({
        next: () => {
          this.cargarInstituciones();
          this.cerrarModal();
        }
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta institución?')) {
      this.crudService.deleteInstitucion(id).subscribe({
        next: () => this.cargarInstituciones()
      });
    }
  }
}