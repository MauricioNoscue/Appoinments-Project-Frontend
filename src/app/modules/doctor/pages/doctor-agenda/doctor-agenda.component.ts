import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DoctorService } from '../../../../shared/services/doctor.service';
import { DoctorCitation } from '../../../../shared/Models/hospital/DoctorListModel';

@Component({
  selector: 'app-doctor-agenda',
  templateUrl: './doctor-agenda.component.html',
  styleUrls: ['./doctor-agenda.component.css'],
  standalone: false
})
export class DoctorAgendaComponent implements OnInit, OnDestroy {

  // TODO: cuando exista autenticación por token, reemplazar por el id real del doctor
  private readonly DOCTOR_ID = 4;

  // UI state
  loading = false;
  errorMsg = '';

  // Doctor header
  doctorName = '—';
  specialty = '—';

  // Consultorio del día seleccionado
  consultingRoom = '—';
  roomCode: string | number = '—';

  // Citas
  allCitations: DoctorCitation[] = [];
  citationsForDay: DoctorCitation[] = [];

  // Totales por jornada
  morningCount = 0;  // 7:00–11:00
  afternoonCount = 0; // 14:00–16:00
  totalForDay = 0;
  upcomingCount = 0; // citas pendientes (no vencidas) para el CTA

  // ===== Calendario (simple, como tu snippet con señales)
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
    return d.getFullYear() === t.getFullYear()
        && d.getMonth() === t.getMonth()
        && d.getDate() === t.getDate();
  }
  isSelected(d?: Date | null) {
    if (!d) return false;
    const s = this.selected();
    return d.getFullYear() === s.getFullYear()
        && d.getMonth() === s.getMonth()
        && d.getDate() === s.getDate();
  }
  pick(d?: Date | null) {
    if (!d) return;
    this.selected.set(d);
    this.recomputeForSelectedDay();
  }

  private destroy$ = new Subject<void>();

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctorHeader();
    this.loadCitations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ======= DATA =======
  private loadDoctorHeader(): void {
    this.doctorService.traerDoctorPorId(this.DOCTOR_ID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (doc: any) => {
          this.doctorName = doc?.fullName || '—';
          this.specialty = doc?.specialty || '—';
        },
        error: () => { /* header fallback */ }
      });
  }

  private loadCitations(): void {
    this.loading = true;
    this.errorMsg = '';
    this.doctorService.getCitationsByDoctor(this.DOCTOR_ID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DoctorCitation[]) => {
          this.allCitations = Array.isArray(res) ? res : [];
          this.recomputeForSelectedDay();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'No fue posible cargar las citas.';
          this.loading = false;
        }
      });
  }

  // ======= LÓGICA DE FILTRO / CÁLCULOS =======
  private recomputeForSelectedDay(): void {
    const sel = this.selected();
    const y = sel.getFullYear(), m = sel.getMonth(), d = sel.getDate();

    // 1) Citas del día seleccionado
    const sameDay = (iso: string) => {
      const dt = new Date(iso);
      return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
    };

    // 2) Solo programadas y no vencidas (ni atendidas/no asistió/canceladas)
    const isPendingState = (s: string) => {
      const v = (s || '').toLowerCase().trim();
      return ['pendiente', 'programada', 'agendada'].includes(v);
    };

    const now = new Date();
    const isFutureOrNow = (dateISO: string, timeBlock: string) => {
      // Si es fecha futura -> OK
      const appointment = new Date(dateISO);
      if (appointment > new Date(now.getFullYear(), now.getMonth(), now.getDate())) return true;
      // Si es hoy -> mostrar TODAS las citas pendientes del día (incluyendo pasadas)
      if (appointment.toDateString() === now.toDateString()) {
        return true;
      }
      return false; // pasado
    };

    let filtered = this.allCitations;
    filtered = filtered.filter(c => sameDay(c.appointmentDate));
    filtered = filtered.filter(c => isPendingState(c.state));
    filtered = filtered.filter(c => isFutureOrNow(c.appointmentDate, c.timeBlock));

    const dayItems = filtered.sort((a, b) => this.timeToMinutes(a.timeBlock) - this.timeToMinutes(b.timeBlock));

    this.citationsForDay = dayItems;
    console.log('Citas finales para el día:', dayItems);

    // consultorio del día (si hay varias, se toma la primera)
    if (dayItems.length) {
      this.consultingRoom = dayItems[0].consultingRoomName || 'Consultorio';
      this.roomCode = dayItems[0].roomNumber ?? '—';
    } else {
      this.consultingRoom = 'Consultorio';
      this.roomCode = '—';
    }

    // 3) Filtrar citas futuras del día actual para el CTA
    const currentTime = new Date();
    const upcomingItems = dayItems.filter(c => {
      if (sel.toDateString() !== currentTime.toDateString()) return true; // si no es hoy, todas son futuras
      const mins = this.timeToMinutes(c.timeBlock);
      const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
      return mins >= currentMins;
    });

    // 4) Conteos por jornada
    const morningItems = dayItems.filter(c => this.isMorning(c.timeBlock));
    const afternoonItems = dayItems.filter(c => this.isAfternoon(c.timeBlock));

    this.morningCount = morningItems.length;
    this.afternoonCount = afternoonItems.length;
    this.totalForDay = dayItems.length;
    this.upcomingCount = upcomingItems.length;
  }

  private timeToMinutes(hhmmss: string): number {
    const [hh, mm] = (hhmmss || '00:00:00').split(':').map(n => +n);
    return (hh * 60) + (mm || 0);
    // Los segundos no afectan para este caso
  }

  private isMorning(hhmmss: string): boolean {
    const m = this.timeToMinutes(hhmmss);
    return m >= (7 * 60) && m < (11 * 60); // 07:00–10:59
  }

  private isAfternoon(hhmmss: string): boolean {
    const m = this.timeToMinutes(hhmmss);
    return m >= (14 * 60) && m < (16 * 60); // 14:00–15:59
  }

  // ======= NAVEGACIÓN =======
  startDay(): void {
    const date = this.selected().toISOString().slice(0, 10);
    this.router.navigate(['/doctor/citas']);
  }
}
