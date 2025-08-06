// DTO para listar ciudades (basado en CityListDto del backend)
export interface CityList {
  departamentId: number;
  name: string;
  departamentName: string;
}

// DTO para crear ciudad (basado en CityCreatedDto del backend)
export interface CityCreate {
  departamentId: number;
  name: string;
}

// DTO para editar ciudad (basado en CityEditDto del backend)
export interface CityEdit {
  id: number;
  departamentId: number;
  name: string;
}

// Interface general para el componente (incluye propiedades adicionales del frontend)
export interface City {
  id?: number;
  cityId?: number; // Para compatibilidad con el modelo anterior
  isDeleted?: boolean;
  registrationDate?: Date;
  departamentId: number;
  name: string;
  departamentName?: string;
  departament?: string; // Para compatibilidad con el modelo anterior
  institutions?: any[];
}

// Interface extendida para el listado con propiedades adicionales del frontend
export interface CityListExtended extends CityList {
  id?: number;
  cityId?: number;
  isDeleted?: boolean;
  registrationDate?: Date;
  institutions?: any[];
}