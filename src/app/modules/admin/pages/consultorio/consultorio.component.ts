import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Consultorio {
  id: number;
  nombre: string;
  ubicacion: string;
  estado: string;
  imagen: string;
}

@Component({
  selector: 'app-consultorio',
  standalone: false,
  templateUrl: './consultorio.component.html',
  styleUrls: ['./consultorio.component.css'],
})
export class ConsultorioComponent {
  searchTerm = '';

  consultorios: Consultorio[] = [
    {
      id: 1,
      nombre: 'Odontología',
      ubicacion: 'Piso 1 - Consultorio #1',
      estado: 'En uso',
      imagen: '../../../../../assets/images/consultorio.png',
    },
    {
      id: 2,
      nombre: 'Odontología',
      ubicacion: 'Piso 1 - Consultorio #2',
      estado: 'En uso',
      imagen: '../../../../../assets/images/consultorio.png',
    },
    {
      id: 3,
      nombre: 'Odontología',
      ubicacion: 'Piso 1 - Consultorio #3',
      estado: 'Disponible',
      imagen: '../../../../../assets/images/consultorio.png',
    },
    {
      id: 4,
      nombre: 'Odontología',
      ubicacion: 'Piso 1 - Consultorio #4',
      estado: 'En uso',
      imagen: '../../../../../assets/images/consultorio.png',
    },
    {
      id: 5,
      nombre: 'Odontología',
      ubicacion: 'Piso 1 - Consultorio #5',
      estado: 'Disponible',
      imagen: '../../../../../assets/images/consultorio.png',
    },
  ];

  constructor(private router: Router) {}

  get consultoriosFiltrados(): Consultorio[] {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return this.consultorios;
    return this.consultorios.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.ubicacion.toLowerCase().includes(q)
    );
  }

  eliminarConsultorio(c: Consultorio) {
    if (confirm(`¿Está seguro de eliminar el consultorio "${c.nombre}"?`)) {
      this.consultorios = this.consultorios.filter((x) => x.id !== c.id);
    }
  }

  // 👇 ESTA FUNCIÓN ES LA QUE FALTABA
  editarConsultorio(c: Consultorio) {
    this.router.navigate(['admin/consultorio/editar', c.id], {
      state: { consultorio: c },
    });
  }

  abrirDialog(_tipo: 'create') {
    this.router.navigate(['admin/consultorio/crear']);
  }
}
