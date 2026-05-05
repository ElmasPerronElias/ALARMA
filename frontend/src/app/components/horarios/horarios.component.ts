import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrudService, HorarioEscolar, Sede } from '../../services/crud.service';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {
  horarios: HorarioEscolar[] = [];
  sedes: Sede[] = [];
  formData: HorarioEscolar = { sede: 0, nombre: '', tipo_jornada: 'MANANA', fecha_inicio: '', fecha_fin: '', activo: true };
  editando = false;
  isLoading = true;
  showModal = false;
  searchTerm = '';

  jornadas = [
    { value: 'MANANA', label: 'Mañana' },
    { value: 'TARDE', label: 'Tarde' },
    { value: 'NOCHE', label: 'Noche' },
    { value: 'COMPLETA', label: 'Jornada Completa' }
  ];

  constructor(private crud: CrudService) {}

  ngOnInit() {
    this.cargar();
    this.cargarSedes();
  }

  cargar() {
    this.isLoading = true;
    this.crud.getHorariosEscolares().subscribe({
      next: (data) => {
        this.horarios = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  cargarSedes() {
    this.crud.getSedes().subscribe(data => this.sedes = data);
  }

  abrirModal(editar = false, item?: HorarioEscolar) {
    this.editando = editar;
    if (editar && item) {
      this.formData = { ...item };
    } else {
      this.formData = { sede: 0, nombre: '', tipo_jornada: 'MANANA', fecha_inicio: '', fecha_fin: '', activo: true };
    }
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.formData = { sede: 0, nombre: '', tipo_jornada: 'MANANA', fecha_inicio: '', fecha_fin: '', activo: true };
    this.editando = false;
  }

  guardar() {
    if (this.editando) {
      this.crud.updateHorarioEscolar(this.formData.id!, this.formData).subscribe(() => {
        this.cargar();
        this.cerrarModal();
      });
    } else {
      this.crud.createHorarioEscolar(this.formData).subscribe(() => {
        this.cargar();
        this.cerrarModal();
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este horario?')) {
      this.crud.deleteHorarioEscolar(id).subscribe(() => this.cargar());
    }
  }

  get horariosFiltrados() {
    if (!this.searchTerm) return this.horarios;
    return this.horarios.filter(h =>
      h.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      h.sede_nombre?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getJornadaLabel(jornada: string): string {
    const found = this.jornadas.find(j => j.value === jornada);
    return found ? found.label : jornada;
  }
}