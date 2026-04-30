import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-instituciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.css']
})
export class InstitucionesComponent implements OnInit {
  instituciones: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getInstituciones().subscribe(data => this.instituciones = data);
  }
}