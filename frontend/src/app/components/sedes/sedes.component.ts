import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sedes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.css']
})
export class SedesComponent implements OnInit {
  sedes: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getSedes().subscribe(data => this.sedes = data);
  }
}