/**
 * Constants for Doctor Dashboard
 * Centralizes all configuration values and business rules
 */

export const DASHBOARD_CONSTANTS = {
  // Time configuration
  SLOT_MINUTES: 30,
  WORKING_HOURS_PER_DAY: 8,
  DONUT_DAYS_RANGE: 30,

  // Week configuration
  WEEK_DAYS: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const,
  WEEK_START_DAY: 1, // Monday (0 = Sunday, 1 = Monday)

  // Default doctor ID (temporary until auth is implemented)
//   DEFAULT_DOCTOR_ID: undefined as number | undefined,
  DEFAULT_DOCTOR_ID: 1,

  // Citation status mappings
  STATUS_MAPPINGS: {
    PENDING: ['pendiente', 'agendada', 'confirmada', 'programada', 'reprogramada', 'pending', 'scheduled', 'confirmed', 'booked'],
    ATTENDED: ['atendida', 'completada', 'finalizada', 'asistió', 'atendido', 'completado', 'finalizado', 'attended', 'completed', 'finished', 'done'],
    MISSED: ['ausente', 'no asistió', 'perdida', 'no atendida', 'ausencia', 'falta', 'missed', 'absent', 'no show'],
    CANCELLED: ['cancelada', 'anulada', 'cancelado', 'anulado', 'cancelled', 'canceled']
  } as const
} as const;

export type CitationStatus = 'pending' | 'attended' | 'missed' | 'cancelled' | 'unknown';
