// dashboard.model.ts
export interface DashboardStats {
  totalCitasAnio: number;
  totalCitasMes: number;
  totalCitasDia: number;
  totalUsuarios: number;
  variationYear: number;
  variationMonth: number;
  variationDay: number;
}

export interface AppointmentStatus {
  total: number;
  scheduled: number;
  completed: number;
  canceled: number;
}

export interface ChartItem {
  label: string;
  value: number;
  percent: number;
  color: string;
}

export const STAFF_STATUS = {
  Inactivo: 'inactivo',
  Ocupado: 'ocupado',
  Activo: 'activo'
} as const;

export type StaffStatus = typeof STAFF_STATUS[keyof typeof STAFF_STATUS];

export interface StaffMember {
  id: number;
  fullName: string;
  specialty: string;
  status: StaffStatus;
  color: string;
  emailDoctor?: string;
}

// Nuevas interfaces para el DashboardDto del backend
export interface CitasDashboard {
  totalCitasDia: number;
  totalCitasSemana: number;
  totalCitasMes: number;
  distribucionPorEspecialidad: { [key: string]: number };
  estadosCitas: { [key: string]: number };
}

export interface PacientesDashboard {
  nuevosRegistrados: { fecha: string; cantidad: number }[];
  pacientesActivos: number;
  pacientesInactivos: number;
}

export interface DoctoresDashboard {
  topDoctores: { nombreDoctor: string; citasAtendidas: number }[];
  doctoresDisponibles: { nombreDoctor: string; cuposLibres: number }[];
  rankingEspecialidades: { [key: string]: number };
}

export interface KpisDashboard {
  tasaAsistencia: number;
  tiempoPromedioEspera: number;
}

export interface DashboardDto {
  citas: CitasDashboard;
  pacientes: PacientesDashboard;
  doctores: DoctoresDashboard;
  kpis: KpisDashboard;
}




export interface DoctorDashboardVMv2 {
  kpis: KpiVM;
  weeklyBars: WeeklyBarsVM;
  donut: DonutVM;
  next: NextCitationVM | null;
  pendingCount: number;
}

export interface KpiVM {
  attendedToday: number;
  presentToday: number;
  absentToday: number;
}

export interface WeeklyBarsVM {
  labels: string[];
  values: number[];
}

export interface DonutVM {
  attended: number;
  notAttended: number;
}

export interface NextCitationVM {
  date: string;
  timeLabel: string;
  note: string | null;
}
