import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrudService, Sede, Institucion } from '../../services/crud.service';

@Component({
  selector: 'app-sedes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.css']
})
export class SedesComponent implements OnInit {
  sedes: Sede[] = [];
  instituciones: Institucion[] = [];
  formData: Sede = {
    institucion: 0,
    nombre: '',
    codigo: '',
    direccion: '',
    telefono: '',
    latitud: 0,
    longitud: 0,
    zona_horaria: 'America/Lima',
    activo: true
  };
  editando = false;
  isLoading = true;
  showModal = false;
  searchTerm = '';

  constructor(private crud: CrudService) {}

  ngOnInit() {
    this.cargar();
    this.cargarInstituciones();
  }

  cargar() {
    this.isLoading = true;
    this.crud.getSedes().subscribe({
      next: (data) => {
        this.sedes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar sedes:', err);
        this.isLoading = false;
      }
    });
  }

  cargarInstituciones() {
    this.crud.getInstituciones().subscribe({
      next: (data) => this.instituciones = data,
      error: (err) => console.error('Error al cargar instituciones:', err)
    });
  }

  abrirModal(editar = false, item?: Sede) {
    this.editando = editar;
    if (editar && item) {
      this.formData = { ...item };
    } else {
      this.formData = {
        institucion: 0,
        nombre: '',
        codigo: '',
        direccion: '',
        telefono: '',
        latitud: 0,
        longitud: 0,
        zona_horaria: 'America/Lima',
        activo: true
      };
    }
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.formData = {
      institucion: 0,
      nombre: '',
      codigo: '',
      direccion: '',
      telefono: '',
      latitud: 0,
      longitud: 0,
      zona_horaria: 'America/Lima',
      activo: true
    };
    this.editando = false;
  }

  guardar() {
    console.log('Datos a guardar:', this.formData);
    
    if (this.editando) {
      this.crud.updateSede(this.formData.id!, this.formData).subscribe({
        next: () => {
          this.cargar();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar la sede');
        }
      });
    } else {
      this.crud.createSede(this.formData).subscribe({
        next: () => {
          this.cargar();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al crear:', err);
          alert('Error al crear la sede. Verifica los datos.');
        }
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta sede?')) {
      this.crud.deleteSede(id).subscribe({
        next: () => this.cargar(),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  get sedesFiltradas() {
    if (!this.searchTerm) return this.sedes;
    return this.sedes.filter(s =>
      s.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.codigo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.institucion_nombre?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}