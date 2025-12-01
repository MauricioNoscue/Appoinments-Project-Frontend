import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';


import { AuthService } from '../../../../shared/services/auth/auth.service';
import { DoctorDashboardVMv2 } from '../../../../shared/Models/dashboard/dashboard.model';
import { DoctorDashboardFacade } from '../../../../shared/Facades/facade';
import { DoctorDashboardService } from '../../../../shared/services/dashboard/doctor-dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {
  vm!: DoctorDashboardVMv2;
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();
  doctorId!: number;

  constructor(
    private dashboardSrv: DoctorDashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.authService.getDoctorId();
    if (id) this.doctorId = id;

    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;
  console.log("hola")
    this.dashboardSrv
      .get(this.doctorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vm) => {
          this.vm = vm;
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar el dashboard. Por favor intenta de nuevo.';
          this.loading = false;
          this.setEmptyVM();
        }
      });
  }

  private setEmptyVM(): void {
    this.vm = {
      kpis: { attendedToday: 0, presentToday: 0, absentToday: 0 },
      weeklyBars: {
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        values: [0, 0, 0, 0, 0, 0]
      },
      donut: { attended: 0, notAttended: 0 },
      next: null,
      pendingCount: 0
    };
  }

  donutStyle() {
    const a = this.vm.donut.attended;
    const b = this.vm.donut.notAttended;
    const total = Math.max(a + b, 1);
    const deg = (a / total) * 360;

    return {
      background: `conic-gradient(#22c55e 0 ${deg}deg, #111827 ${deg}deg 360deg)`
    };
  }

  maxWeekly(): number {
    return Math.max(...this.vm.weeklyBars.values, 1);
  }

  toPct(value: number): string {
    const max = this.maxWeekly();
    return `${(value / max) * 100}%`;
  }

  getTotalWeeklyCitas(): number {
    return this.vm.weeklyBars.values.reduce((a, b) => a + b, 0);
  }

  getPeakDay(): string {
    const values = this.vm.weeklyBars.values;
    const max = Math.max(...values);
    const idx = values.indexOf(max);
    return this.vm.weeklyBars.labels[idx] ?? '—';
  }

  isPeakDay(i: number): boolean {
    const max = Math.max(...this.vm.weeklyBars.values);
    return this.vm.weeklyBars.values[i] === max;
  }

  getYAxisTicks(): number[] {
    const max = this.maxWeekly();
    const step = Math.max(1, Math.floor(max / 5));
    const ticks: number[] = [];

    for (let i = 0; i <= max; i += step) ticks.push(i);
    if (ticks[ticks.length - 1] !== max) ticks.push(max);

    return ticks;
  }
}