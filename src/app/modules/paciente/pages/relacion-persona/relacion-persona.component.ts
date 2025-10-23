import { Component, Input, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment.development'; // ✅ SIEMPRE este
import Swal from 'sweetalert2';

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
import { AuthService } from '../../../../shared/services/auth/auth.service';

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
  styleUrls: ['./relacion-persona.component.css'],
})
export class RelacionPersonaComponent {
  // Input opcional
  @Input() personId?: number;

  private dialog = inject(MatDialog);
  private svc = inject(RelatedPersonService);
  private route = inject(ActivatedRoute);

  // estado UI
  readonly people = signal<RelatedPersonList[]>([]);
  selectedId = signal<number | null>(null);
  toRemove: RelatedPersonList | null = null;

  // ===== Resolver personId =====
  private _resolvedId: number | null = null;

  @Input()
  set personIdSetter(v: number | string | undefined) {
    const parsed = typeof v === 'string' ? Number(v) : v ?? null;
    this.tryResolveAndLoad(parsed);
  }
  get personIdSetter() {
    return this.personId;
  }

  constructor(private readonly userService : AuthService) {
    const fromRoute = Number(this.route.snapshot.paramMap.get('personId'));
    this.tryResolveAndLoad(
      Number.isFinite(fromRoute) && fromRoute > 0 ? fromRoute : null
    );

    if (!this._resolvedId || this._resolvedId <= 0) {
      // const devId = (environment as any).defaultPersonId as number | undefined;
      const devId = this.userService.getUserId()

      if (devId && devId > 0) {
        console.warn('[DEV] Usando defaultPersonId:', devId);
        this.tryResolveAndLoad(devId);
      }
    }
  }

  private tryResolveAndLoad(id: number | null): void {
    if (id && id > 0) {
      this._resolvedId = id;
      this.personId = id;
      this.load();
    }
  }

  // ===== Colores persistidos (front) =====
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
  private ensureColors(list: RelatedPersonList[]): RelatedPersonList[] {
    const map = this.loadColorMap();
    let changed = false;
    for (const p of list) {
      if (!map[p.id]) {
        map[p.id] = this.getRandomColor();
        changed = true;
      }
      (p as any).color = map[p.id];
    }
    if (changed) this.saveColorMap(map);
    return list;
  }

  private load(): void {
    if (!this._resolvedId || this._resolvedId <= 0) return;
    this.svc.getByPerson(this._resolvedId).subscribe({
      next: (list) => this.people.set(this.ensureColors(list)),
      error: (err) => {
        console.error(err);
        this.showError('Error cargando personas relacionadas');
      },
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

  // ---- Ver detalle con Swal (modal bonito)
  view(p: RelatedPersonList) {
    const html = `
      <div style="display:flex;gap:12px;align-items:center">
        <div style="width:72px;height:72px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:700;color:white;background:${
          p.color || '#4f46e5'
        }">
          ${this.initials(p.fullName)}
        </div>
        <div style="flex:1">
          <h3 style="margin:0">${p.fullName}</h3>
          <div style="color:gray;margin-top:4px">${p.relation}</div>
        </div>
      </div>
      <hr/>
      <div style="margin-top:8px">
        <div><strong>Identificación:</strong> ${p.document || '—'}</div>
        <div><strong>Tipo documento:</strong> ${p.documentTypeName || '—'}</div>
      </div>
    `;

    Swal.fire({
      title: 'Detalles de persona',
      html,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'Cerrar',
      width: '560px',
    });
  }

  // ===== Crear =====
  addPerson() {
    const ref = this.dialog.open(FormRelacionPersonaComponent, {
      data: { mode: 'create' as const },
      disableClose: true,
    });

    ref.afterClosed().subscribe((val: PersonFormValue | null) => {
      if (!val || !this._resolvedId) return;

      const dto: RelatedPersonCreate = {
        personId: this._resolvedId,
        firstName: val.name.trim(),
        lastName: val.lastname.trim(),
        relation: String(val.relation).trim(),
        documentTypeId: val.documentTypeId!,
        document: val.idNumero?.trim() || '',
      };

      this.svc.crear(dto).subscribe({
        next: () => {
          this.load();
          this.showSuccess('Persona creada con éxito');
        },
        error: (err) => {
          console.error(err);
          this.showError('Error creando persona relacionada');
        },
      });
    });
  }

  // ===== Editar =====
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
        next: () => {
          this.load();
          this.showSuccess('Cambios guardados con éxito');
        },
        error: (err) => {
          console.error(err);
          this.showError('Error actualizando persona relacionada');
        },
      });
    });
  }

  // ===== Eliminar con confirmación Swal =====
  confirmRemove(p: RelatedPersonList) {
    this.toRemove = p;

    Swal.fire({
      title: 'Eliminar persona relacionada',
      html: `¿Seguro que deseas eliminar a <strong>${p.fullName}</strong> (${p.relation})?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      width: '520px',
    }).then((res) => {
      if (!res.isConfirmed) {
        this.toRemove = null;
        return;
      }

      // mostrar loading mientras se elimina
      Swal.fire({
        title: 'Eliminando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      this.svc.eliminar(p.id).subscribe({
        next: () => {
          // limpiar selección y color local sin recargar
          if (this.selectedId() === p.id) this.selectedId.set(null);
          const map = this.loadColorMap();
          if (map[p.id]) {
            delete map[p.id];
            this.saveColorMap(map);
          }
          this.people.update((arr) => arr.filter((x) => x.id !== p.id));

          Swal.close();
          this.toRemove = null;
          this.showSuccess('Persona eliminada con éxito');
        },
        error: (err) => {
          console.error(err);
          Swal.close();
          this.toRemove = null;
          this.showError('Error eliminando persona relacionada');
        },
      });
    });
  }

  // ===== Helpers: mostrar feedback con Swal =====
  private showSuccess(msg: string) {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: msg,
      confirmButtonText: 'OK',
    });
  }

  private showError(msg: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: msg,
      confirmButtonText: 'Cerrar',
    });
  }
}
