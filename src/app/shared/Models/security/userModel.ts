export interface UsuarioCreacion {
  email: string;
  password: string;
  active: boolean;
  person: {
    fullName: string;
    fullLastName: string;
    documentTypeId: number;
    document: string;
    dateBorn: string; // ISO date string
    phoneNumber: string;
    epsName: string;
    epsId: number;
    gender: string;
    healthRegime: string;
  };
}
export interface UsuarioEdicion {
  id: number;
  email: string;
  person: {
    fullName: string;
    fullLastName: string;
    documentTypeId: number;
    document: string;
    dateBorn: string;
    phoneNumber: string;
    epsName: string;
    epsId: number;
    gender: string;
    healthRegime: string;
  };
}

export interface UsuarioListado {
  id: number;
  email: string;
  active: boolean;
  codePassword: string;
  restrictionPoint: number;
  isDeleted: boolean;
  registrationDate: string;
  person: {
    id: number;
    fullName: string;
    fullLastName: string;
    documentTypeName: string | null;
    documentTypeAcronymName: string | null;
    document: string;
    dateBorn: string;
    phoneNumber: string;
    epsName: string | null;
    gender: string;
    healthRegime: string;
    isDeleted: boolean;
    registrationDate: string;
  };
}