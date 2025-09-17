import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DoctorCitation } from '../Models/hospital/DoctorListModel';
import { DoctorService } from '../services/doctor.service';
import { DASHBOARD_CONSTANTS, CitationStatus } from '../../modules/doctor/pages/dashboard/dashboard.constants';
import { DashboardUtils } from '../../modules/doctor/pages/dashboard/dashboard.utils';

export interface NextAppointment {
  id: number;
  date: Date;
  timeLabel: string;
  note: string;
}

export interface DoctorDashboardVM {
  kpis: { attendedToday: number; presentToday: number; absentToday: number };
  weeklyBars: { labels: string[]; values: number[] };
  donut: { attended: number; notAttended: number };
  next: NextAppointment | null;
  pendingCount: number;
  shifts: { day: string; hours: number }[];
  slotMin: number;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorDashboardFacade {
  constructor(private doctorService: DoctorService) {}

  /**
   * Calculate weekly shifts based on appointments
   */
  private calculateWeeklyShifts(citations: DoctorCitation[], week: { start: Date; end: Date }): { day: string; hours: number }[] {
    const dayHours = new Array(6).fill(0);

    for (let idx = 0; idx < 6; idx++) {
      const appointmentsPerDay = citations.filter(cit => {
        const citDate = DashboardUtils.parseCitationDate(cit);
        return DashboardUtils.getWeekdayIndex(citDate) === idx &&
               citDate >= week.start && citDate <= week.end;
        // Count ALL appointments for shifts calculation (consistent with weekly bars)
      }).length;

      if (appointmentsPerDay > 0) {
        dayHours[idx] = DashboardUtils.calculateWorkingHours(appointmentsPerDay);
      }
    }

    return DASHBOARD_CONSTANTS.WEEK_DAYS.map((day, i) => ({
      day,
      hours: +dayHours[i].toFixed(1)
    }));
  }

  /**
   * Validate citations data
   */
  private validateCitations(cits: DoctorCitation[]): DoctorCitation[] {
    if (!Array.isArray(cits)) {
      console.error('Invalid citations data received:', cits);
      return [];
    }
    return cits;
  }

  load(doctorId?: number): Observable<DoctorDashboardVM> {
    if (!doctorId) {
      throw new Error('Doctor ID is required for dashboard data');
    }

    return this.doctorService.getCitationsByDoctor(doctorId).pipe(
      map((cits: DoctorCitation[]) => {
        // Data is already filtered by doctor, just validate
        const filteredCits = this.validateCitations(cits);

        // Calculate all dashboard metrics
        const now = new Date();
        const week = DashboardUtils.getWeekRange(now);

        const kpis = this.calculateKPIs(filteredCits, now);
        const weeklyBars = this.calculateWeeklyBars(filteredCits, week);
        const donut = this.calculateDonutData(filteredCits, now);
        const next = this.findNextAppointment(filteredCits, now);
        const pendingCount = this.countPendingAppointments(filteredCits);
        const shifts = this.calculateWeeklyShifts(filteredCits, week);

        return {
          kpis,
          weeklyBars,
          donut,
          next,
          pendingCount,
          shifts,
          slotMin: DASHBOARD_CONSTANTS.SLOT_MINUTES
        };
      })
    );
  }

  /**
   * Calculate KPIs for today
   */
  private calculateKPIs(citations: DoctorCitation[], now: Date): { attendedToday: number; presentToday: number; absentToday: number } {
    const today = DashboardUtils.formatToYMD(now);
    const todayCits = citations.filter(c => DashboardUtils.formatToYMD(DashboardUtils.parseCitationDate(c)) === today);

    const attendedToday = todayCits.filter(c => DashboardUtils.getCitationStatus(c.state) === 'attended').length;
    const presentToday = attendedToday;

    const absentToday = todayCits.filter(c => {
      const status = DashboardUtils.getCitationStatus(c.state);
      const appointmentDate = DashboardUtils.parseCitationDate(c);
      return status === 'missed' || (status === 'pending' && appointmentDate < now);
    }).length;

    return { attendedToday, presentToday, absentToday };
  }

  /**
   * Calculate weekly bars data - COUNTS ALL APPOINTMENTS REGARDLESS OF STATUS
   * This shows the doctor their complete activity for each day of the week,
   * including pending, attended, cancelled, missed, etc.
   */
  private calculateWeeklyBars(citations: DoctorCitation[], week: { start: Date; end: Date }): { labels: string[]; values: number[] } {
    const labels = [...DASHBOARD_CONSTANTS.WEEK_DAYS];
    const values = new Array(6).fill(0);

    citations.forEach(c => {
      const d = DashboardUtils.parseCitationDate(c);
      if (d >= week.start && d <= week.end) {
        const idx = DashboardUtils.getWeekdayIndex(d);
        if (idx >= 0 && idx <= 5) {
          values[idx] += 1; // Count ALL appointments
        }
      }
    });

    return { labels, values };
  }

  /**
   * Calculate donut chart data for the last 30 days
   */
  private calculateDonutData(citations: DoctorCitation[], now: Date): { attended: number; notAttended: number } {
    const since = new Date(now);
    since.setDate(since.getDate() - DASHBOARD_CONSTANTS.DONUT_DAYS_RANGE);

    let attended = 0, notAttended = 0;

    citations.forEach(c => {
      const d = DashboardUtils.parseCitationDate(c);
      if (d >= since && d <= now) {
        const status = DashboardUtils.getCitationStatus(c.state);
        if (status === 'attended') {
          attended++;
        } else if (status === 'missed' || (status === 'pending' && d < now)) {
          notAttended++;
        }
      }
    });

    return { attended, notAttended };
  }

  /**
   * Find the next upcoming appointment
   */
  private findNextAppointment(citations: DoctorCitation[], now: Date): NextAppointment | null {
    const upcoming = citations
      .filter(c => {
        const d = DashboardUtils.parseCitationDate(c);
        return d > now && DashboardUtils.getCitationStatus(c.state) === 'pending';
      })
      .sort((a, b) => +DashboardUtils.parseCitationDate(a) - +DashboardUtils.parseCitationDate(b))[0];

    if (!upcoming) return null;

    const date = DashboardUtils.parseCitationDate(upcoming);
    return {
      id: upcoming.id,
      date,
      timeLabel: (upcoming as any).timeBlock ?? DashboardUtils.formatTimeLabel(date),
      note: upcoming.note ?? ''
    };
  }

  /**
   * Count pending appointments
   */
  private countPendingAppointments(citations: DoctorCitation[]): number {
    return citations.filter(c => DashboardUtils.getCitationStatus(c.state) === 'pending').length;
  }


  /**
   * Test citation status classification (for debugging)
   */
  testStateClassification(testState: string): CitationStatus {
    return DashboardUtils.getCitationStatus(testState);
  }
}

