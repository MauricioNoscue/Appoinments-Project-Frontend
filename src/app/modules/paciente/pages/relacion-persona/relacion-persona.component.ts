import {
  Component,
  inject,
  signal,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material (standalone)
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormRelacionPersonaComponent } from '../../Components/Form/form-relacion-persona/form-relacion-persona.component';



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
  name: string;
  lastname: string;
  relation: Relation;
  color: string;
  avatarText?: string;
  idNumero?: string;
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
    MatDialogModule,
  ],
  templateUrl: './relacion-persona.component.html',
  styleUrl: './relacion-persona.component.css',
})
export class RelacionPersonaComponent {
  private dialog = inject(MatDialog);

  // Referencia al template "Detalles"
  @ViewChild('detailDialog') detailDialog!: TemplateRef<any>;

  // Datos “quemados” por ahora
  readonly people = signal<PersonCard[]>([
    {
      id: 1,
      name: 'Andrés Mauricio',
      lastname: 'Noscue Cerquera',
      relation: 'Hijo',
      color: '#17BF63',
      idNumero: '10223344',
    },
    {
      id: 2,
      name: 'Juan David',
      lastname: 'Artunduaga Vepez',
      relation: 'Sobrino',
      color: '#FF2D2D',
      idNumero: '99887766',
    },
    {
      id: 3,
      name: 'Esteban',
      lastname: 'Palomar Murcia',
      relation: 'Papá',
      color: '#8256FF',
      idNumero: '55443322',
    },
    {
      id: 4,
      name: 'María Isabel',
      lastname: 'Gómez Pardo',
      relation: 'Hija',
      color: '#0EA5E9',
      idNumero: '99887766',
    },
    {
      id: 5,
      name: 'Sergio Andrés',
      lastname: 'Leguízamo Ruiz',
      relation: 'Tío',
      color: '#F59E0B',
      idNumero: '99887766',
    },
  ]);

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

  // ====== Detalles (ng-template) ======
  view(p: PersonCard) {
    this.dialog.open(this.detailDialog, { data: p, autoFocus: true });
  }

  // ====== Crear ======
  addPerson() {
    const ref = this.dialog.open(FormRelacionPersonaComponent, {
      data: { mode: 'create' as const },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return; // cancelado
      const nextId = Math.max(0, ...this.people().map((x) => x.id)) + 1;
      this.people.update((list) => [
        ...list,
        { ...result, id: nextId } as PersonCard,
      ]);
    });
  }

  // ====== Editar / Actualizar ======
  edit(p: PersonCard) {
    const ref = this.dialog.open(FormRelacionPersonaComponent, {
      data: { mode: 'edit' as const, person: p },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return; // cancelado
      this.people.update((list) =>
        list.map((x) => (x.id === p.id ? { ...x, ...result } : x))
      );
    });
  }

  // ====== Eliminar ======
  remove(p: PersonCard) {
    this.people.update((list) => list.filter((x) => x.id !== p.id));
    if (this.selectedId() === p.id) this.selectedId.set(null);
  }
}
