import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material (standalone)
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

type Relation =
  | 'Papá'
  | 'Mamá'
  | 'Hijo'
  | 'Hija'
  | 'Hermano'
  | 'Hermana'
  | 'Tío'
  | 'Tía'
  | 'Sobrino'
  | 'Sobrina'
  | 'Abuelo'
  | 'Abuela'
  | 'Otro';

export interface PersonCard {
  id: number;
  name: string; // Nombre
  lastname: string; // Apellido(s)
  relation: Relation;
  color: string; // color del círculo (hex)
  avatarText?: string; // si no la envías, se calcula con iniciales
}

@Component({
  selector: 'app-relacion-persona',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './relacion-persona.component.html',
  styleUrl: './relacion-persona.component.css',
})
export class RelacionPersonaComponent {
  // Datos de ejemplo: cámbialos por tu servicio
  readonly people = signal<PersonCard[]>([
    {
      id: 1,
      name: 'Andrés Mauricio',
      lastname: 'Noscue Cerquera',
      relation: 'Hijo',
      color: '#17BF63',
    },
    {
      id: 2,
      name: 'Juan David',
      lastname: 'Artunduaga vepez',
      relation: 'Sobrino',
      color: '#FF2D2D',
    },
    {
      id: 3,
      name: 'Esteban',
      lastname: 'Palomar Murcia',
      relation: 'Papá',
      color: '#8256FF',
    },
    {
      id: 4,
      name: 'Andrés Mauricio',
      lastname: 'Noscue Cerquera',
      relation: 'Hijo',
      color: '#17BF63',
    },
    {
      id: 5,
      name: 'Juan David',
      lastname: 'Artunduaga vepez',
      relation: 'Sobrino',
      color: '#FF2D2D',
    },
  ]);

  // seleccionado
  selectedId = signal<number | null>(2);

  initials(p: PersonCard): string {
    if (p.avatarText?.trim())
      return p.avatarText.trim().slice(0, 2).toUpperCase();
    const parts = `${p.name} ${p.lastname}`.trim().split(/\s+/);
    const [a = '', b = ''] = [parts[0] ?? '', parts[1] ?? ''];
    return `${a.charAt(0)}${b.charAt(0)}`.toUpperCase();
  }

  select(p: PersonCard) {
    this.selectedId.set(p.id === this.selectedId() ? null : p.id);
  }

  addPerson() {
    // Aquí abres tu modal / navegación para crear persona
    console.log('Agregar persona');
  }

  edit(p: PersonCard) {
    console.log('Editar', p);
  }

  remove(p: PersonCard) {
    console.log('Eliminar', p);
  }

  view(p: PersonCard) {
    console.log('Ver', p);
  }
}
