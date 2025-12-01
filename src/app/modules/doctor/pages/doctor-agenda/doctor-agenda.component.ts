import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SheduleList, CitationList } from '../../../../shared/Models/newdoctor';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { DoctorNewService } from '../../../../shared/services/Hospital/doctor-new.service';

@Component({
  selector: 'app-doctor-agenda',
  templateUrl: './doctor-agenda.component.html',
  styleUrls: ['./doctor-agenda.component.css'],
  standalone: false
})
export class DoctorAgendaComponent implements OnInit, OnDestroy {

  DOCTOR_ID!: number;

  loading = false;
  errorMsg = '';

  // Header
  doctorName = '—';
  specialty = '—';

  consultingRoom = '—';
  roomCode: string | number = '—';

  // Citas del día
  citationsForDay: CitationList[] = [];

  morningCount = 0;
  afternoonCount = 0;
  upcomingCount = 0;

  today = new Date();
  currentYear = signal(this.today.getFullYear());
  currentMonth = signal(this.today.getMonth());
  selected = signal(
    new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate())
  );

  monthName = computed(() =>
    new Date(this.currentYear(), this.currentMonth(), 1).toLocaleDateString(
      'es-CO', { month: 'long', year: 'numeric' }
    )
  );

  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  private destroy$ = new Subject<void>();

  constructor(
    private doctorSrv: DoctorNewService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.auth.getDoctorId();
    if (!id) { this.errorMsg = 'Doctor no identificado.'; return; }
    this.DOCTOR_ID = id;

    this.loadSchedule();
    this.loadCitationsForSelectedDay();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =======================
  // CARGAR CONSULTORIO
  // =======================
  private loadSchedule(): void {
    this.doctorSrv.getSheduleByDoctor(this.DOCTOR_ID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: SheduleList[]) => {
          if (data.length) {
            this.consultingRoom = data[0].consultingRoomName;
            this.roomCode = data[0].roomNumber;
            this.doctorName = data[0].nameDoctor;
            this.specialty = data[0].typeCitationName;
          }
        }
      });
  }

  // =======================
  // CARGAR CITAS DEL DÍA
  // =======================
  private loadCitationsForSelectedDay(): void {
    this.loading = true;

    const date = this.selected().toISOString().slice(0, 10);

    this.doctorSrv.getCitationsByDoctor(this.DOCTOR_ID, date)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items: CitationList[]) => {
          this.loading = false;
          this.citationsForDay = (items || []).sort(
            (a, b) => this.timeToMinutes(a.timeBlock) - this.timeToMinutes(b.timeBlock)
          );

          this.computeKpis();
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'No fue posible cargar las citas.';
        }
      });
  }

  // =======================
  // KPIs
  // =======================
  private computeKpis(): void {
    const list = this.citationsForDay;

    this.morningCount = list.filter(c => this.isMorning(c.timeBlock)).length;
    this.afternoonCount = list.filter(c => this.isAfternoon(c.timeBlock)).length;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    this.upcomingCount = list.filter(c => {
      const m = this.timeToMinutes(c.timeBlock);
      return m >= currentMinutes;
    }).length;
  }

  private timeToMinutes(hhmmss: string | null): number {
    if (!hhmmss) return 0;
    const [hh, mm] = hhmmss.split(':').map(Number);
    return hh * 60 + mm;
  }

  private isMorning(h: string | null) {
    const m = this.timeToMinutes(h);
    return m >= 7 * 60 && m <= 11 * 60;
  }

  private isAfternoon(h: string | null) {
    const m = this.timeToMinutes(h);
    return m >= 14 * 60 && m <= 16 * 60;
  }

  // =======================
  // CALENDARIO
  // =======================
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

  pick(d?: Date | null) {
    if (!d) return;
    this.selected.set(d);
    this.loadCitationsForSelectedDay();
  }

  prevMonth() {
    const m = this.currentMonth(), y = this.currentYear();
    m === 0 ? (this.currentMonth.set(11), this.currentYear.set(y - 1))
            : this.currentMonth.set(m - 1);
  }

  nextMonth() {
    const m = this.currentMonth(), y = this.currentYear();
    m === 11 ? (this.currentMonth.set(0), this.currentYear.set(y + 1))
             : this.currentMonth.set(m + 1);
  }

  isToday(d?: Date | null) {
    if (!d) return false;
    const t = this.today;
    return d.toDateString() === t.toDateString();
  }

  isSelected(d?: Date | null) {
    if (!d) return false;
    const s = this.selected();
    return d.toDateString() === s.toDateString();
  }

  isPast(d?: Date | null) {
    if (!d) return false;
    const t = this.today;
    return d < new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }

 startDay(): void {
  const date = this.selected().toISOString().slice(0, 10);
  this.router.navigate(['/doctor/citas', date]);
}

}
