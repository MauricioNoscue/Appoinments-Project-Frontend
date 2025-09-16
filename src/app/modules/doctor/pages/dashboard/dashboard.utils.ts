import { Citation } from '../../../../shared/Models/hospital/CitationModel';
import { DASHBOARD_CONSTANTS, CitationStatus } from './dashboard.constants';

/**
 * Utility functions for Doctor Dashboard data processing
 */

export class DashboardUtils {

  /**
   * Classify citation status based on state string
   */
  static getCitationStatus(state: string): CitationStatus {
    const normalizedState = (state || '').toLowerCase().trim();

    if (DASHBOARD_CONSTANTS.STATUS_MAPPINGS.PENDING.some(s => normalizedState.includes(s))) {
      return 'pending';
    }
    if (DASHBOARD_CONSTANTS.STATUS_MAPPINGS.ATTENDED.some(s => normalizedState.includes(s))) {
      return 'attended';
    }
    if (DASHBOARD_CONSTANTS.STATUS_MAPPINGS.MISSED.some(s => normalizedState.includes(s))) {
      return 'missed';
    }
    if (DASHBOARD_CONSTANTS.STATUS_MAPPINGS.CANCELLED.some(s => normalizedState.includes(s))) {
      return 'cancelled';
    }

    return 'unknown';
  }

  /**
   * Parse citation date from various formats (supports both Citation and DoctorCitation)
   */
  static parseCitationDate(citation: any): Date {
    const raw: any = citation.appointmentDate ?? citation.date ?? citation.registrationDate;

    if (raw instanceof Date) {
      return raw;
    }

    if (typeof raw === 'number') {
      return new Date(raw);
    }

    if (typeof raw === 'string') {
      const parsed = new Date(raw);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
      // Try alternative format
      return new Date(raw.replace(' ', 'T'));
    }

    // Fallback to current date
    return new Date();
  }

  /**
   * Get week range for a given date
   */
  static getWeekRange(date: Date): { start: Date; end: Date } {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + DASHBOARD_CONSTANTS.WEEK_START_DAY);
    const end = new Date(start);
    end.setDate(start.getDate() + 5); // Saturday
    return { start, end };
  }

  /**
   * Get weekday index (0 = Monday, 5 = Saturday)
   */
  static getWeekdayIndex(date: Date): number {
    return (date.getDay() + 6) % 7;
  }

  /**
   * Format date to YYYY-MM-DD
   */
  static formatToYMD(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Check if date is today
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  /**
   * Check if date is in the future
   */
  static isFuture(date: Date): boolean {
    const now = new Date();
    return date > now;
  }

  /**
   * Check if date is in the past
   */
  static isPast(date: Date): boolean {
    const now = new Date();
    return date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  /**
   * Format time label
   */
  static formatTimeLabel(date: Date): string {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Calculate working hours based on appointments
   */
  static calculateWorkingHours(appointmentsCount: number): number {
    const hours = appointmentsCount * (DASHBOARD_CONSTANTS.SLOT_MINUTES / 60);
    return Math.min(DASHBOARD_CONSTANTS.WORKING_HOURS_PER_DAY, hours);
  }
}