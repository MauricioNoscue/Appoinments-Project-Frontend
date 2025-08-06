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