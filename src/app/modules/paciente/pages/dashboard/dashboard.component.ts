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
import { Stat, TipoCita, NewsItem, norm, TIPO_CITA_MAP } from './modelsDashboard';
import { CitationList } from '../../../../shared/Models/hospital/CitationModel';
import { AuthService } from '../../../../shared/services/auth/auth.service';

declare var bootstrap: any;



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
// ============================
// REFACCIÓN COMPLETA — LIMPIO
// ============================

export class DashboardComponent implements OnInit {

  // ====== Servicios ======
  private router = inject(Router);
  private citaSrv = inject(CitationService);
  private notifSrv = inject(NotificationService);
  private relSrv = inject(RelatedPersonService);
  private typeSrv = inject(TypeCitationService);
  private authservice = inject(AuthService);

  // ====== UI ======
  query = '';

  // ====== Stats ======
  stats = signal<Stat[]>([
    { icon: 'event', label: 'Mis citas', value: 0, color: '#ff6b6b' },
    { icon: 'groups', label: 'Familia', value: 0, color: '#7c4dff' },
    { icon: 'notifications', label: 'Novedades', value: 0, color: '#ffb300' },
  ]);

  citasProgramadasCnt = signal(0);
  noLeidasCnt = signal(0);
  familiaCnt = signal(0);

  // ====== Tipos ======
  tipos: TipoCita[] = [];

  // ====== Novedades ======
  novedades = signal<NewsItem[]>([]);

  // ====== Calendario (igual) ======
  today = new Date();
  currentYear = signal(this.today.getFullYear());
  currentMonth = signal(this.today.getMonth());
  selected = signal(new Date());

  monthName = computed(() =>
    new Date(this.currentYear(), this.currentMonth(), 1).toLocaleDateString(
      'es-CO',
      { month: 'long', year: 'numeric' }
    )
  );

  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // =====================================================
  //                 NG ON INIT
  // =====================================================
  ngOnInit(): void {
    this.initData();
  }

  // =====================================================
  //              ORQUESTADOR / FACHADA
  // =====================================================
  private initData(): void {
    this.loadTiposCita();
    this.loadCitasProgramadas();
    this.loadNotificaciones();
    this.loadFamilia();
  }

  // =====================================================
  //                  CARGA DE DATOS
  // =====================================================

  private loadTiposCita(): void {
  this.typeSrv.traerTodo().subscribe({
    next: (list: any[]) => {

      // 🔥 Filtrar SOLO los que tienen horarios
      const filtered = list.filter(x => x.hasShedule === true);

      this.tipos = filtered.map((x: any) => {
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
          icon: x.imageName || imgFromCatalog ? undefined : 'event'
        };
      });
    }
  });
}


  private loadCitasProgramadas(): void {
  this.citaSrv.GetAllUser().subscribe({
    next: (arr: CitationList[]) => {
      // Solo citas con estado "Programada" = id 1

      const programadas = arr.filter(c => c?.statustypesId === 1).length;

      this.citasProgramadasCnt.set(programadas);
      this.updateStat('Mis citas', programadas);
    }
  });
}


  private loadNotificaciones(): void {
    this.notifSrv.GetAllUser().subscribe({
      next: (list: any[]) => {
        const noLeidas = list.filter(n => !n?.stateNotification);
        
        this.noLeidasCnt.set(noLeidas.length);
        this.updateStat('Novedades', noLeidas.length);

        const top3 = [...noLeidas]
  .sort(
    (a, b) =>
      new Date(b?.createdAt || 0).getTime() -
      new Date(a?.createdAt || 0).getTime()
  )
  .slice(0, 3)
  .map((n): NewsItem => ({
    title: n.typeCitationName || 'Notificación',
    date: n.createdAt ? new Date(n.createdAt).toLocaleString() : '—',
    text: n.message || '',
    status: 'pendiente' as const
  }));

this.novedades.set(top3);

      }
    });
  }

  private loadFamilia(): void {
    const personId = this.authservice.getPersonId();
    if (!personId || personId <= 0) return;

    this.relSrv.getByPerson(personId).subscribe({
      next: (list: any[]) => {
        this.familiaCnt.set(list.length);
        this.updateStat('Familia', list.length);
      }
    });
  }

  // =====================================================
  //                   LÓGICA DE STATS
  // =====================================================
  
  private updateStat(label: Stat['label'], value: number): void {
    this.stats.update(arr =>
      arr.map(s => s.label === label ? { ...s, value } : s)
    );
  }

  // =====================================================
  //                     UI ACTIONS
  // =====================================================

  goTo(label: Stat['label']) {
    switch (label) {
      case 'Mis citas':
        return this.openOffcanvas('offcanvasExample2');
      case 'Familia':
        return this.router.navigate(['/paciente/relacion']);
      case 'Novedades':
        return this.openOffcanvas('offcanvasExample');
    }
  }

  private openOffcanvas(id: string) {
    const el = document.getElementById(id);
    if (el) bootstrap.Offcanvas.getOrCreateInstance(el).show();
  }

  doSearch() {
    console.log('Buscar:', this.query);
  }

  openTipo(t: TipoCita) {
    if (t?.id) this.router.navigate([`paciente/CitationAviable/${t.id}`]);
  }

  verTodo() {
    this.router.navigate(['/paciente/notificaciones']);
  }
}
