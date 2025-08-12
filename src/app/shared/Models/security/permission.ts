// export interface PermissionCreated {
//   permission: {
//     name: string;
//     description: string;
//   };
// }
// export interface PermissionEdit {
//   id: number;
//   permission: {
//     name: string;
//     description: string;
//   };
// }
// export interface PermissionList {
//   id: number;
//   isDeleted: boolean;
//   registrationDate: string | null; // ISO string
//   permission: {
//     name: string;
//     description: string;
//   };
// }
// export interface PermissionC {
//     id?: number;
//     name: string;
//     permisos?: string[];
//     description: string;
// }


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

