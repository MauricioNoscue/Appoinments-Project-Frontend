export interface RolList{
    id: number,
    name: string,
    description:string
    IsDeleted:boolean

}


export interface RolCreated{
     Name: string,
    Description:string
}

export interface RolC {
  id?: number;
  nombre: string;
  descripcion: string;
}



export interface RolUpdated{
    id: number,
    name: string,
    description:string

}

export interface AssignRolesDto {
  userId: number;
  rolIds: number[];
}
export interface UpdateUserRolesDto {
  userId: number;
  rolIds: number[];
}
export interface PermissionAssignmentDto {
  formId: number;
  permissionId: number;
}

export interface AssignPermissionsDto {
  rolId: number;
  permissions: PermissionAssignmentDto[];
}
export interface UpdateRolFormPermissionsDto {
  rolId: number;
  permissions: PermissionAssignmentDto[];
}

export interface RolPermisosResponse {
  rol: string;
  permisos: {
    form: string;
    permiso: string;
  }[];
}

