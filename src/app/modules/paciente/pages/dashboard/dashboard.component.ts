import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';

// Servicios propios
import { CitationService } from '../../../../shared/services/citation.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { RelatedPersonService } from '../../../../shared/services/related-person.service';
import { TypeCitationService } from '../../../../shared/services/Hospital/type-citation.service';
import { environment } from '../../../../../environments/environment.development';

declare var bootstrap: any;

type Stat = {
  icon: string;
  label: 'Mis citas' | 'Familia' | 'Novedades';
  value: number;
  color?: string;
};

type NewsItem = {
  title: string;
  date: string;
  text: string;
  status: 'pendiente' | 'confirmada';
};

type TipoCita = {
  id: number;
  label: string;
  color: string;
  icon?: string; // respaldo si no hay imagen
  img?: string; // ruta a /assets/... cuando venga imageName o catálogo
};

// ====================
// Catálogo nombres → imagen
// ====================
function norm(s: string): string {
  return (s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .trim();
}

const TIPO_CITA_CATALOGO: Array<{ name: string; img: string }> = [
  { name: 'consulta General', img: '/assets/icons/IconsTypeCitation/CExterna.png' },
  { name: 'odontologia',img: '/assets/icons/IconsTypeCitation/odontologia.png', },
  { name: 'pediatria', img: '/assets/icons/IconsTypeCitation/pediatria.svg' },
  { name: 'citologia', img: '/assets/icons/IconsTypeCitation/citologia.svg' },
  { name: 'vacunacion', img: '/assets/icons/IconsTypeCitation/vacunacion.svg' },
  { name: 'psicologia', img: '/assets/icons/IconsTypeCitation/psicologia.svg' },
  {name: 'fisioterapia',img: '/assets/icons/IconsTypeCitation/fisioterapia.svg',},
  { name: 'optometria', img: '/assets/icons/IconsTypeCitation/optometria.svg' },
];

const TIPO_CITA_MAP = new Map(
  TIPO_CITA_CATALOGO.map((x) => [norm(x.name), x.img])
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatBadgeModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  // ===== Inyección de servicios
  private router = inject(Router);
  private citaSrv = inject(CitationService);
  private notifSrv = inject(NotificationService);
  private relSrv = inject(RelatedPersonService);
  private typeSrv = inject(TypeCitationService);

  // ===== Topbar
  query = '';

  // ===== Stats
  stats = signal<Stat[]>([
    { icon: 'event', label: 'Mis citas', value: 0, color: '#ff6b6b' },
    { icon: 'groups', label: 'Familia', value: 0, color: '#7c4dff' },
    { icon: 'notifications', label: 'Novedades', value: 0, color: '#ffb300' },
  ]);

  // Contadores
  citasProgramadasCnt = signal(0);
  noLeidasCnt = signal(0);
  familiaCnt = signal(0);

  // ===== Tipos de cita (ARRAY normal)
  tipos: TipoCita[] = [];

  // ===== Novedades
  novedades = signal<NewsItem[]>([]);

  // ===== Calendario
  today = new Date();
  currentYear = signal(this.today.getFullYear());
  currentMonth = signal(this.today.getMonth());
  selected = signal(
    new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate()
    )
  );
  monthName = computed(() =>
    new Date(this.currentYear(), this.currentMonth(), 1).toLocaleDateString(
      'es-CO',
      {
        month: 'long',
        year: 'numeric',
      }
    )
  );
  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  get monthMatrix(): (Date | null)[] {
    const y = this.currentYear();
    const m = this.currentMonth();
    const first = new Date(y, m, 1);
    const startIndex = first.getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startIndex; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }
  prevMonth() {
    const m = this.currentMonth(),
      y = this.currentYear();
    m === 0
      ? (this.currentMonth.set(11), this.currentYear.set(y - 1))
      : this.currentMonth.set(m - 1);
  }
  nextMonth() {
    const m = this.currentMonth(),
      y = this.currentYear();
    m === 11
      ? (this.currentMonth.set(0), this.currentYear.set(y + 1))
      : this.currentMonth.set(m + 1);
  }
  isToday(d?: Date | null) {
    if (!d) return false;
    const t = this.today;
    return (
      d.getFullYear() === t.getFullYear() &&
      d.getMonth() === t.getMonth() &&
      d.getDate() === t.getDate()
    );
  }
  isSelected(d?: Date | null) {
    if (!d) return false;
    const s = this.selected();
    return (
      d.getFullYear() === s.getFullYear() &&
      d.getMonth() === s.getMonth() &&
      d.getDate() === s.getDate()
    );
  }
  pick(d?: Date | null) {
    if (d) this.selected.set(d);
  }

  // ===== Carga de datos
  ngOnInit(): void {
    // 0) Tipos de cita desde API
    this.typeSrv.traerTodo().subscribe({
      next: (list: any[]) => {
        this.tipos = list.map((x: any) => {
          const rawName = x.name ?? x.title ?? 'Tipo';
          const key = norm(rawName);

          const imgFromCatalog = TIPO_CITA_MAP.get(key);

          return {
            id: x.id,
            label: rawName,
            color: x.color ?? '#e2e8f0',
            img: x.imageName
              ? `/assets/icons/IconsTypeCitation/${x.imageName}`
              : imgFromCatalog,
            icon: x.imageName || imgFromCatalog ? undefined : 'event',
          } as TipoCita;
        });
      },
    });

    // 1) Citas programadas
    this.citaSrv.traerListado().subscribe({
      next: (arr: any[]) => {
        const programadas = arr.filter((c) => c?.state === 'Programada').length;
        this.citasProgramadasCnt.set(programadas);
        this.updateStat('Mis citas', programadas);
      },
    });

    // 2) Notificaciones
    this.notifSrv.traerTodo().subscribe({
      next: (list: any[]) => {
        const noLeidas = list.filter((n) => !n?.stateNotification);
        this.noLeidasCnt.set(noLeidas.length);
        this.updateStat('Novedades', noLeidas.length);

        const top3 = [...noLeidas]
          .sort(
            (a, b) =>
              new Date(b?.createdAt || 0).getTime() -
              new Date(a?.createdAt || 0).getTime()
          )
          .slice(0, 3)
          .map((n) => ({
            title: n?.typeCitationName || 'Notificación',
            date: n?.createdAt ? new Date(n.createdAt).toLocaleString() : '—',
            text: n?.message || '',
            status: 'pendiente' as const,
          }));
        this.novedades.set(top3);
      },
    });

    // 3) Familia
    const personId = (environment as any).defaultPersonId as number | undefined;
    if (personId && personId > 0) {
      this.relSrv.getByPerson(personId).subscribe({
        next: (list: any[]) => {
          this.familiaCnt.set(list.length);
          this.updateStat('Familia', list.length);
        },
      });
    }
  }

  // ===== Navegación desde los stats
  goTo(label: Stat['label']) {
    switch (label) {
      case 'Mis citas': {
        const el = document.getElementById('offcanvasExample2');
        if (el) bootstrap.Offcanvas.getOrCreateInstance(el).show();
        break;
      }
      case 'Familia':
        this.router.navigate(['/paciente/relacion']);
        break;
      case 'Novedades': {
        const el = document.getElementById('offcanvasExample');
        if (el) bootstrap.Offcanvas.getOrCreateInstance(el).show();
        break;
      }
    }
  }

  // ===== Util
  private updateStat(label: Stat['label'], value: number) {
    this.stats.update((arr) =>
      arr.map((s) => (s.label === label ? { ...s, value } : s))
    );
  }

  // ===== Acciones UI
  doSearch() {
    console.log('Buscar:', this.query);
  }

  openTipo(t: TipoCita) {
    if (t?.id) this.router.navigate([`admin/CitationAviable/${t.id}`]);
    else console.log('Elegido tipo:', t.label);
  }

  verTodo() {
    this.router.navigate(['/paciente/notificaciones']);
  }
}
