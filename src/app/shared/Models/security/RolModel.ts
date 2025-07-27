export interface RolList{
    id: number,
    name: string,
    description:string
    IsDeleted:boolean

}


export interface RolCreated{
     name: string,
    description:string
}

export interface RolC {
  id?: number;
  nombre: string;
  permisos: string[];
  descripcion: string;
}



export interface RolUpdated{
    id: number,
    name: string,
    description:string

}