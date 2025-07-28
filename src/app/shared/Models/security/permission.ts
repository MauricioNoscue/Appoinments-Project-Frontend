export interface PermissionCreated {
  permission: {
    name: string;
    description: string;
  };
}
export interface PermissionEdit {
  id: number;
  permission: {
    name: string;
    description: string;
  };
}
export interface PermissionList {
  id: number;
  isDeleted: boolean;
  registrationDate: string | null; // ISO string
  permission: {
    name: string;
    description: string;
  };
}
