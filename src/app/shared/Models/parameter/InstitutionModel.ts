export interface InstitutionList {
  id: number;
  isDeleted: boolean;
  registrationDate: Date;
  cityId: number;
  name: string;
  nit: string;
  email: string;
  cityName: string;
  branchs: any[]; // Array de sucursales relacionadas
}

export interface InstitutionCreate {
  cityId: number;
  name: string;
  nit: string;
  email: string;
}

export interface InstitutionUpdate {
  id?: number;
  cityId: number;
  name: string;
  nit: string;
  email: string;
}

export interface Institution {
  id?: number;
  isDeleted?: boolean;
  registrationDate?: Date;
  cityId: number;
  name: string;
  nit: string;
  email: string;
  city?: string;
  branchs?: any[];
}
export interface InstitutionOption {
  id: number;
  name: string;
}
