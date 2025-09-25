import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DoctorDashboardFacade, DoctorDashboardVM } from '../../../../shared/Facades/doctor-dashboard.facade';
import { DASHBOARD_CONSTANTS } from './dashboard.constants';
import { AuthService } from '../../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {
  vm!: DoctorDashboardVM;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  doc!:number

  constructor(private facade: DoctorDashboardFacade,private authService:AuthService) {}

  ngOnInit(): void {
    const doctorId = this.authService.getDoctorId();
    if(doctorId){
      this.doc = doctorId
    }
 
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load dashboard data with proper error handling
   */
  loadDashboard(): void {
    this.loading = true;
    this.error = null;

    

    // TODO: Get doctorId from authentication token when implemented
    const doctorId = this.doc;

    this.facade.load(doctorId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (vm) => {
        this.vm = vm;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.error = 'No se pudo cargar el dashboard. Por favor, intenta de nuevo.';
        this.loading = false;
        this.setEmptyVM();
      }
    });
  }

  /**
   * Set empty VM to prevent template errors
   */
  private setEmptyVM(): void {
    this.vm = {
      kpis: { attendedToday: 0, presentToday: 0, absentToday: 0 },
      weeklyBars: {
        labels: [...DASHBOARD_CONSTANTS.WEEK_DAYS],
        values: new Array(6).fill(0)
      },
      donut: { attended: 0, notAttended: 0 },
      next: null,
      pendingCount: 0,
      shifts: [],
      slotMin: DASHBOARD_CONSTANTS.SLOT_MINUTES
    };
  }

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

  /**
   * Get total weekly appointments
   */
  getTotalWeeklyCitas(): number {
    return this.vm?.weeklyBars.values.reduce((sum, val) => sum + val, 0) ?? 0;
  }

  /**
   * Get the day with the most appointments
   */
  getPeakDay(): string {
    if (!this.vm?.weeklyBars.values.length) return '—';

    const maxValue = Math.max(...this.vm.weeklyBars.values);
    const maxIndex = this.vm.weeklyBars.values.indexOf(maxValue);
    return this.vm.weeklyBars.labels[maxIndex] || '—';
  }

  /**
   * Check if a day is the peak day
   */
  isPeakDay(index: number): boolean {
    if (!this.vm?.weeklyBars.values.length) return false;

    const maxValue = Math.max(...this.vm.weeklyBars.values);
    return this.vm.weeklyBars.values[index] === maxValue;
  }

  /**
   * Get Y-axis ticks for the chart
   */
  getYAxisTicks(): number[] {
    const max = this.maxWeekly();
    const ticks = [];
    for (let i = 0; i <= max; i += Math.max(1, Math.floor(max / 5))) {
      ticks.push(i);
    }
    if (ticks[ticks.length - 1] !== max) {
      ticks.push(max);
    }
    return ticks;
  }
}
