// DepartamentCreated
export interface DepartamentCreated {
  name: string;
}

// DepartamentEdit
export interface DepartamentEdit {
  id: number;
  name: string;
}
export interface Departament {
  id?: number;
  departamentId?: number; // Para compatibilidad con el modelo anterior
  isDeleted?: boolean;
  registrationDate?: Date;
  name: string;
}

// DepartamentList
export interface DepartamentList {
  id: number;
  isDeleted: boolean;
  registrationDate: string | null; // en formato ISO
  name: string;
}

export interface DepartamentOption {
  id: number;
  name: string;
}
