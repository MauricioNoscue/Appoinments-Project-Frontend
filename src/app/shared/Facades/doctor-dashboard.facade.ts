import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Citation } from '../Models/hospital/CitationModel';
import { CitationService } from '../services/citation.service';

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
  private readonly SLOT_MIN = 30;

  constructor(private citationService: CitationService) {}

  // Función auxiliar para clasificar estados de citas
  private getCitationStatus(state: string): 'pending' | 'attended' | 'missed' | 'cancelled' | 'unknown' {
    const normalizedState = (state || '').toLowerCase().trim();

    console.log(`🔍 Estado original: "${state}" -> normalizado: "${normalizedState}"`);

    if (['pendiente', 'agendada', 'confirmada', 'programada', 'reprogramada', 'pending', 'scheduled', 'confirmed', 'booked'].some(s => normalizedState.includes(s))) {
      console.log(`✅ Clasificado como PENDING: "${state}"`);
      return 'pending';
    }
    if (['atendida', 'completada', 'finalizada', 'asistió', 'atendido', 'completado', 'finalizado', 'attended', 'completed', 'finished', 'done'].some(s => normalizedState.includes(s))) {
      console.log(`✅ Clasificado como ATTENDED: "${state}"`);
      return 'attended';
    }
    if (['ausente', 'no asistió', 'perdida', 'no atendida', 'ausencia', 'falta', 'missed', 'absent', 'no show'].some(s => normalizedState.includes(s))) {
      console.log(`✅ Clasificado como MISSED: "${state}"`);
      return 'missed';
    }
    if (['cancelada', 'anulada', 'cancelado', 'anulado', 'cancelled', 'canceled'].some(s => normalizedState.includes(s))) {
      console.log(`✅ Clasificado como CANCELLED: "${state}"`);
      return 'cancelled';
    }

    console.log(`❓ Estado desconocido: "${state}" -> "${normalizedState}"`);
    return 'unknown';
  }

  load(doctorId?: number): Observable<DoctorDashboardVM> {
    const allCitations$ = this.citationService.traerTodo();

    return allCitations$.pipe(
      map((cits: Citation[]) => {
        console.log('📊 Datos recibidos del servicio:', cits);
        console.log('📊 Número total de citas:', cits?.length || 0);

        // Verificar que tenemos un array válido
        if (!Array.isArray(cits)) {
          console.error('❌ Los datos recibidos no son un array válido:', cits);
          cits = [];
        }

        // Filtrar citas por doctor si se proporciona doctorId
        const filteredCits = doctorId ? cits.filter(c => (c as any).doctorId === doctorId) : cits;
        console.log('📊 Citas filtradas:', filteredCits.length);

        // Mostrar estados de todas las citas para debugging
        console.log('📋 Estados de todas las citas:');
        const stateCount: Record<string, number> = {};
        filteredCits.forEach(c => {
          console.log(`   Cita ${c.id}: estado="${c.state}"`);
          const status = this.getCitationStatus(c.state);
          stateCount[status] = (stateCount[status] || 0) + 1;
        });
        console.log('📊 Resumen de clasificación de estados:', stateCount);

        // Diagnóstico de estados no reconocidos
        const unrecognizedStates = filteredCits
          .filter(c => this.getCitationStatus(c.state) === 'unknown')
          .map(c => c.state)
          .filter((value, index, self) => self.indexOf(value) === index); // únicos

        if (unrecognizedStates.length > 0) {
          console.warn('⚠️ Estados no reconocidos encontrados:', unrecognizedStates);
          console.log('💡 Sugerencia: Agrega estos estados a la función getCitationStatus');
        }
        const now = new Date();
        const today = this.toYMD(now);
        const week = this.weekRange(now);

        // Logging de estados para debugging
        const logStateClassification = (state: string, classification: string) => {
          console.log(`🔍 Estado original: "${state}" -> clasificado como: ${classification}`);
        };

        const isPending = (c: Citation) => this.getCitationStatus(c.state) === 'pending';
        const isAttended = (c: Citation) => this.getCitationStatus(c.state) === 'attended';
        const isMissed = (c: Citation) => this.getCitationStatus(c.state) === 'missed';
        const isCancelled = (c: Citation) => this.getCitationStatus(c.state) === 'cancelled';

        const getDate = (c: Citation) => {
          // tu contrato sample usa appointmentDate; el genérico tenía date.
          const raw: any = (c as any).appointmentDate ?? (c as any).date ?? c.date;
          let parsedDate: Date;

          if (raw instanceof Date) {
            parsedDate = raw;
          } else if (typeof raw === 'number') {
            parsedDate = new Date(raw);
          } else if (typeof raw === 'string') {
            // Intentar diferentes formatos de fecha
            parsedDate = new Date(raw);
            if (isNaN(parsedDate.getTime())) {
              // Si falla, intentar con formato específico
              parsedDate = new Date(raw.replace(' ', 'T'));
            }
          } else {
            console.warn(`⚠️ Fecha inválida para cita ${c.id}:`, raw);
            parsedDate = new Date(); // fallback
          }

          console.log(`📅 Cita ${c.id}: raw date = ${raw}, parsed = ${parsedDate}, isValid = ${!isNaN(parsedDate.getTime())}`);
          return parsedDate;
        };

        // --- KPIs de hoy ---
        const todayCits = filteredCits.filter(c => this.toYMD(getDate(c)) === today);
        console.log('📊 Citas de hoy encontradas:', todayCits.length);
        console.log('📊 Citas de hoy:', todayCits.map(c => ({ id: c.id, date: c.date, state: c.state })));

        // Pacientes presentes (hoy): citas de hoy en attended
        const attendedToday = todayCits.filter(c => isAttended(c)).length;
        const presentToday = attendedToday;

        // Pacientes ausentes (hoy): citas de hoy que están en missed o pending cuyo horario ya pasó
        const absentToday = todayCits.filter(c => {
          const status = this.getCitationStatus(c.state);
          return status === 'missed' || (status === 'pending' && getDate(c) < now);
        }).length;

        console.log('📊 KPIs de hoy:', { attendedToday, presentToday, absentToday });

        // --- Barras semana (Lun..Sab) - solo citas no canceladas ---
        const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const values = new Array(6).fill(0);
        console.log('📊 Semana actual:', { start: week.start, end: week.end });

        filteredCits.forEach(c => {
          const d = getDate(c);
          if (d >= week.start && d <= week.end) {
            const status = this.getCitationStatus(c.state);
            console.log(`📊 Cita ${c.id} en semana: fecha=${d}, estado=${status}`);
            if (status !== 'cancelled') { // No contar citas canceladas
              const idx = this.weekdayIndex(d); // 0=Mon..5=Sat
              if (idx >= 0 && idx <= 5) {
                values[idx] += 1; // total de citas activas ese día
                console.log(`📊 Agregada al día ${idx} (${labels[idx]}): total ahora ${values[idx]}`);
              }
            }
          }
        });
        console.log('📊 Valores barras semanales:', values);

        // --- Donut (últimos 30 días): asistencia vs no asistencia ---
        const since = new Date(now);
        since.setDate(since.getDate() - 30);
        console.log('📊 Rango donut:', { since, now });

        let attended30 = 0, notAttended30 = 0;
        filteredCits.forEach(c => {
          const d = getDate(c);
          if (d >= since && d <= now) {
            const status = this.getCitationStatus(c.state);
            console.log(`📊 Cita ${c.id} en rango donut: fecha=${d}, estado=${status}`);
            if (status === 'attended') {
              attended30++;
              console.log(`📊 Contada como atendida: ${attended30}`);
            } else if (status === 'missed' || (status === 'pending' && d < now)) {
              notAttended30++;
              console.log(`📊 Contada como no atendida: ${notAttended30}`);
            }
          }
        });
        console.log('📊 Resultados donut:', { attended30, notAttended30 });

        // --- Próxima cita: la más cercana en el futuro cuya categoría sea pending ---
        const upcoming = filteredCits
          .filter(c => {
            const d = getDate(c);
            return d > now && isPending(c);
          })
          .sort((a, b) => +getDate(a) - +getDate(b))[0];

        const next: NextAppointment | null = upcoming
          ? {
            id: upcoming.id,
            date: getDate(upcoming),
            timeLabel: (upcoming as any).timeBlock ?? this.timeLabel(getDate(upcoming)),
            note: upcoming.note ?? ''
          }
          : null;

        // --- Citas pendientes: todas las pending (futuras o sin hora cumplida) ---
        const pendingCount = filteredCits.filter(c => {
          const status = this.getCitationStatus(c.state);
          return status === 'pending';
        }).length;

        // --- Turnos de la semana (cálculo mejorado basado en citas programadas activas) ---
        // TODO: Cuando se implemente el servicio de actividad del doctor, reemplazar esta lógica
        // con datos reales de tiempo activo en la plataforma
        const dayHours = new Array(6).fill(0);
        const workingHoursPerDay = 8; // Horas laborales típicas por día

        // Calcular horas por día basado en citas programadas (excluyendo canceladas)
        for (let idx = 0; idx < 6; idx++) {
          const citasPorDia = filteredCits.filter(cit => {
            const citDate = getDate(cit);
            const status = this.getCitationStatus(cit.state);
            return this.weekdayIndex(citDate) === idx &&
                   citDate >= week.start && citDate <= week.end &&
                   status !== 'cancelled'; // Excluir citas canceladas
          }).length;

          // Estimar horas basado en número de citas y jornada laboral
          if (citasPorDia > 0) {
            dayHours[idx] = Math.min(workingHoursPerDay, citasPorDia * (this.SLOT_MIN / 60));
          }
        }
        const shifts = labels.map((day, i) => ({ day, hours: +dayHours[i].toFixed(1) }));

        const vm: DoctorDashboardVM = {
          kpis: { attendedToday, presentToday, absentToday },
          weeklyBars: { labels, values },
          donut: { attended: attended30, notAttended: notAttended30 },
          next,
          pendingCount,
          shifts,
          slotMin: this.SLOT_MIN
        };

        console.log('📊 VM final:', vm);

        // Verificación final de integridad de datos
        if (vm.kpis.attendedToday < 0 || vm.kpis.absentToday < 0 || vm.pendingCount < 0) {
          console.warn('⚠️ Valores negativos detectados en VM:', vm);
        }

        return vm;
      })
    );
  }

  private toYMD(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private weekRange(date: Date): { start: Date; end: Date } {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1); // Monday
    const end = new Date(start);
    end.setDate(start.getDate() + 5); // Saturday
    return { start, end };
  }

  private weekdayIndex(date: Date): number {
    return (date.getDay() + 6) % 7; // 0 = Mon, 5 = Sat
  }

  private timeLabel(date: Date): string {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  // Función de utilidad para diagnosticar estados
  testStateClassification(testState: string): string {
    return this.getCitationStatus(testState);
  }
}

// Función auxiliar para testing (disponible globalmente para debugging)
function getCitationStatus(state: string): 'pending' | 'attended' | 'missed' | 'cancelled' | 'unknown' {
  const norm = (s: string) => (s || '').toLowerCase().trim();
  const normalizedState = norm(state);

  if (['pendiente', 'agendada', 'confirmada', 'programada', 'reprogramada', 'pending', 'scheduled', 'confirmed', 'booked'].some(s => normalizedState.includes(s))) {
    return 'pending';
  }
  if (['atendida', 'completada', 'finalizada', 'asistió', 'atendido', 'completado', 'finalizado', 'attended', 'completed', 'finished', 'done'].some(s => normalizedState.includes(s))) {
    return 'attended';
  }
  if (['ausente', 'no asistió', 'perdida', 'no atendida', 'ausencia', 'falta', 'missed', 'absent', 'no show'].some(s => normalizedState.includes(s))) {
    return 'missed';
  }
  if (['cancelada', 'anulada', 'cancelado', 'anulado', 'cancelled', 'canceled'].some(s => normalizedState.includes(s))) {
    return 'cancelled';
  }
  return 'unknown';
}
