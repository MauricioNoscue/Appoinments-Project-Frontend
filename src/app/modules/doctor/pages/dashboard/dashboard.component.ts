import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DoctorDashboardFacade, DoctorDashboardVM } from '../../../../shared/Facades/doctor-dashboard.facade';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {
  vm!: DoctorDashboardVM;
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(private facade: DoctorDashboardFacade) {}

  ngOnInit(): void {
    // TODO: Obtener doctorId del token/autenticación cuando esté implementado
    const doctorId = undefined; // Por ahora undefined, se implementará con token
    console.log('🚀 Iniciando carga del dashboard...');

    this.facade.load(doctorId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (vm) => {
        console.log('✅ Dashboard cargado exitosamente:', vm);
        this.vm = vm;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error cargando dashboard:', error);
        this.loading = false;
        // Crear VM vacío para evitar errores en template
        this.vm = {
          kpis: { attendedToday: 0, presentToday: 0, absentToday: 0 },
          weeklyBars: { labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], values: [0, 0, 0, 0, 0, 0] },
          donut: { attended: 0, notAttended: 0 },
          next: null,
          pendingCount: 0,
          shifts: [],
          slotMin: 30
        };
      }
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  donutStyle() {
    const a = this.vm?.donut.attended ?? 0;
    const b = this.vm?.donut.notAttended ?? 0;
    const total = Math.max(a + b, 1);
    const deg = (a / total) * 360;
    return { background: `conic-gradient(#22c55e 0 ${deg}deg, #111827 ${deg}deg 360deg)` };
  }

  /** Para la barra semanal (valores 0..max) */
  maxWeekly() {
    return Math.max(...(this.vm?.weeklyBars.values ?? [0,0,0,0,0,0]), 1);
  }

  toPct(v: number, max: number) {
    return `${(v / Math.max(max,1)) * 100}%`;
  }
}
