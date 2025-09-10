export interface RelatedPersonList {
  id: number;
  personId: number;
  fullName: string;
  relation: string;
  documentTypeName: string | null;
  document: string;
  active?: boolean;
  color?: string; // 👈 añadido
}

export interface RelatedPersonCreate {
  personId: number;
  firstName: string;
  lastName: string;
  relation: string;
  documentTypeId: number;
  document: string;
}

export interface RelatedPersonEdit {
  id: number;
  firstName: string;
  lastName: string;
  relation: string;
  documentTypeId: number;
  document: string;
  active?: boolean;
}
