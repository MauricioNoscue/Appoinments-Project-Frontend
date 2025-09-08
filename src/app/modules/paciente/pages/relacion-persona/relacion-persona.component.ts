import {
  Component,
  Input,
  inject,
  signal,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment.development'; // ✅ SIEMPRE este
// Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import {
  RelatedPersonList,
  RelatedPersonCreate,
  RelatedPersonEdit,
} from '../../../../shared/Models/hospital/RelatedPerson';
import { RelatedPersonService } from '../../../../shared/services/related-person.service';
import {
  FormRelacionPersonaComponent,
  PersonFormValue,
} from '../../Components/Form/form-relacion-persona/form-relacion-persona.component';

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
  // ✅ Input opcional (puede no venir mientras no hay login)
  @Input() personId?: number;

  private dialog = inject(MatDialog);
  private svc = inject(RelatedPersonService);
  private route = inject(ActivatedRoute);

  @ViewChild('detailDialog') detailDialog!: TemplateRef<any>;

  readonly people = signal<RelatedPersonList[]>([]);
  selectedId = signal<number | null>(null);

  // ===== Setter para reaccionar a cambios del @Input y aplicar fallback
  private _resolvedId: number | null = null;

  @Input()
  set personIdSetter(v: number | string | undefined) {
    const parsed = typeof v === 'string' ? Number(v) : v ?? null;
    this.tryResolveAndLoad(parsed);
  }

  // compat con el template actual; si usas [personId] esto no rompe
  get personIdSetter() {
    return this.personId;
  }

  constructor() {
    // Intentar resolver al construir, por si viene por ruta
    const fromRoute = Number(this.route.snapshot.paramMap.get('personId'));
    this.tryResolveAndLoad(
      Number.isFinite(fromRoute) && fromRoute > 0 ? fromRoute : null
    );

    // Si no vino ni por input ni por ruta, usa fallback DEV (no afecta prod)
    if (!this._resolvedId || this._resolvedId <= 0) {
      const devId = (environment as any).defaultPersonId as number | undefined;
      if (devId && devId > 0) {
        console.warn('[DEV] Usando defaultPersonId:', devId);
        this.tryResolveAndLoad(devId);
      }
    }
  }

  private tryResolveAndLoad(id: number | null): void {
    if (id && id > 0) {
      this._resolvedId = id;
      this.personId = id; // solo para logs si lo usas
      console.log('RelacionPersonaComponent -> personId:', id);
      this.load();
    }
  }

  // ====== Colores (solo front, persistidos por id en localStorage) ======
  private readonly COLOR_STORAGE_KEY = 'rp_colors_v1';

  private loadColorMap(): Record<number, string> {
    try {
      return JSON.parse(localStorage.getItem(this.COLOR_STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  }

  private saveColorMap(map: Record<number, string>) {
    localStorage.setItem(this.COLOR_STORAGE_KEY, JSON.stringify(map));
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++)
      color += letters[Math.floor(Math.random() * 16)];
    return color;
  }

  /** Asegura que cada persona tenga un color estable; lo guarda y lo inyecta al item */
  private ensureColors(list: RelatedPersonList[]): RelatedPersonList[] {
    const map = this.loadColorMap();
    let changed = false;

    for (const p of list) {
      if (!map[p.id]) {
        map[p.id] = this.getRandomColor();
        changed = true;
      }
      p.color = map[p.id];
    }

    if (changed) this.saveColorMap(map);
    return list;
  }
  // ===============================================================

  private load(): void {
    if (!this._resolvedId || this._resolvedId <= 0) return;
    this.svc.getByPerson(this._resolvedId).subscribe({
      next: (list) => this.people.set(this.ensureColors(list)), // 👈 aplica colores
      error: (err) =>
        console.error('Error cargando personas relacionadas', err),
    });
  }

  initials(fullName: string): string {
    const parts = (fullName || '').trim().split(/\s+/);
    const a = parts[0]?.charAt(0) ?? '';
    const b = parts[1]?.charAt(0) ?? '';
    return (a + b).toUpperCase();
  }

  select(p: RelatedPersonList) {
    this.selectedId.set(this.selectedId() === p.id ? null : p.id);
  }

  view(p: RelatedPersonList) {
    this.dialog.open(this.detailDialog, { data: p, autoFocus: true });
  }

  addPerson() {
    const ref = this.dialog.open(FormRelacionPersonaComponent, {
      data: { mode: 'create' as const },
      disableClose: true,
    });

    ref.afterClosed().subscribe((val: PersonFormValue | null) => {
      if (!val || !this._resolvedId) return;

      const dto: RelatedPersonCreate = {
        personId: this._resolvedId, // ✅ ya resuelto
        firstName: val.name.trim(),
        lastName: val.lastname.trim(),
        relation: String(val.relation).trim(),
        documentTypeId: val.documentTypeId!,
        document: val.idNumero?.trim() || '',
      };

      this.svc.crear(dto).subscribe({
        next: () => this.load(), // al recargar, se asigna color y se persiste
        error: (err) => {
          console.error('Error creando persona relacionada:', err);
          alert(err?.error?.message ?? err?.error ?? 'Error creando persona');
        },
      });
    });
  }

  edit(p: RelatedPersonList) {
    const names = (p.fullName || '').trim().split(/\s+/);
    const first = names[0] ?? '';
    const rest = names.slice(1).join(' ');

    const ref = this.dialog.open(FormRelacionPersonaComponent, {
      data: {
        mode: 'edit' as const,
        person: {
          id: p.id,
          name: first,
          lastname: rest,
          relation: p.relation as Relation,
          idNumero: p.document,
          documentTypeId: undefined,
          color: p.color ?? '#4f46e5',
        },
      },
      disableClose: true,
    });

    ref.afterClosed().subscribe((val: PersonFormValue | null) => {
      if (!val) return;

      const dto: RelatedPersonEdit = {
        id: p.id,
        firstName: val.name.trim(),
        lastName: val.lastname.trim(),
        relation: String(val.relation).trim(),
        documentTypeId: val.documentTypeId!,
        document: val.idNumero?.trim() || '',
      };

      this.svc.actualizar(dto).subscribe({
        next: () => this.load(),
        error: (err) => {
          console.error('Error actualizando persona relacionada', err);
          alert(
            err?.error?.message ?? err?.error ?? 'Error actualizando persona'
          );
        },
      });
    });
  }

  remove(p: RelatedPersonList) {
    this.svc.eliminar(p.id).subscribe({
      next: () => {
        if (this.selectedId() === p.id) this.selectedId.set(null);

        // Quitar del UI sin recargar y limpiar su color del localStorage
        this.people.update((arr) => arr.filter((x) => x.id !== p.id));
        const map = this.loadColorMap();
        if (map[p.id]) {
          delete map[p.id];
          this.saveColorMap(map);
        }

        // Si prefieres recargar del backend, usa:
        // this.load();
      },
      error: (err) => {
        console.error('Error eliminando persona relacionada', err);
        alert(err?.error?.message ?? err?.error ?? 'Error eliminando persona');
      },
    });
  }
}
