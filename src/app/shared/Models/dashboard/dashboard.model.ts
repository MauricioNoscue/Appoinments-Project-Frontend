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
}

