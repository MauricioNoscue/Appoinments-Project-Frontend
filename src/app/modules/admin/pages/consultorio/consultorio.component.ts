import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormConsultorioComponent } from '../../Components/forms/FormsBase/form-consultorio/form-consultorio.component';

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

  constructor(private router: Router, private dialog: MatDialog) {}

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
  // ✳️ Abrir modal en modo EDITAR
  editarConsultorio(c: Consultorio) {
    const ref = this.dialog.open(FormConsultorioComponent, {
      width: '720px',
      data: { modo: 'editar', consultorio: c },
      disableClose: true,
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      // Aquí podrías actualizar la lista con result.values si luego conectas servicio
      console.log('Editar (modal) -> resultado:', result);
    });
  }

  // ✳️ Abrir modal en modo CREAR
  abrirDialog(_tipo: 'create') {
    const ref = this.dialog.open(FormConsultorioComponent, {
      width: '720px',
      data: { modo: 'crear' },
      disableClose: true,
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      console.log('Crear (modal) -> resultado:', result);
      // Ejemplo mock (sin servicio): añadir a la lista
      // const id = Math.max(...this.consultorios.map(x => x.id), 0) + 1;
      // this.consultorios = [...this.consultorios, { id, ...result.values }];
    });
  }
}
