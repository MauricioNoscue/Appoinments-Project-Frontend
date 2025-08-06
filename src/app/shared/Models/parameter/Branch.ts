export interface BranchCreated {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  institutionId: number;
}

export interface BranchEdit {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  institutionId: number;
}
export interface Branch {
  id?: number;
  branchId?: number; // Para compatibilidad con el modelo anterior
  isDeleted?: boolean;
  registrationDate?: Date;
  institutionId: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  institutionName?: string;
  institution?: string; // Para compatibilidad con el modelo anterior
  employees?: any[]; // Puedes adaptar este arreglo según tus relaciones reales
}

export interface BranchList {
  id: number;
  isDeleted: boolean;
  registrationDate: string | null; // ISO string, como en PermissionList
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  institutionId: number;
  institutionName: string;
}
