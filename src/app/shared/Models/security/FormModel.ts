export interface FormList {
  id: number;
  name: string;
  description: string;
  url: string;
  isDeleted: boolean;
}

export interface FormsCreates {
  name: string;
  url: string;
  description: string;
}

export interface FormC {
  id?: number;
  name: string;
  url: string;
  description: string;
}