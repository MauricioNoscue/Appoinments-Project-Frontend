export interface UsuarioCreacion {

  email: string;
  password: string;
  active: boolean;
  personId: number;
}
export interface UsuarioEdicion {
  id: number;
    email: string;
  password: string;
  active: boolean;
  personId: number;
 
}

export interface UsuarioListado {

  id: number;
  personId: number;
  personName: string;
  email: string;
  active: boolean;
  codePassword: string;
  restrictionPoint: number;
  isDeleted: boolean;
  registrationDate: string; 
}
  export interface LoginModel{

    email: string;
    password: string;
  }




 // Interfaces
export interface PersonList {
  fullName: string;
  fullLastName: string;
  documentTypeId: number;
  document: string;
  dateBorn: string;
  phoneNumber: string;
  epsId: number;
  gender: string;
  healthRegime: string;
}
 // Interfaces
export interface PersonUpdate {
  id:number
  fullName: string;
  fullLastName: string;
  documentTypeId: number;
  document: string;
  dateBorn: string;
  phoneNumber: string;
  epsId: number;
  gender: string;
  healthRegime: string;
}


