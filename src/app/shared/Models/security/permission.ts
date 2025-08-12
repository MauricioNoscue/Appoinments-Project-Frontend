

export interface PermissionList {
  id: number;
  name: string;
  description: string;
  isDeleted: boolean;
};

export interface PermissionCreated {
    name: string;
    description: string;
}


export interface PermissionC {
    id?: number;
    name: string;
    permisos?: string[];
    description: string;
}

export interface PermissionEdit {
    id: number;
    name: string;
    description: string;
}



 export interface PermissionListar {
 id: number;
  name: string; 
   description: string;
  isDeleted: boolean;
};