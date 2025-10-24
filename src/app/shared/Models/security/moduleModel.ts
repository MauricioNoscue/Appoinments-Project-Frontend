export interface ModuleCreated{

      Name: string,
    Description:string
}

export interface ModuleEdid{
    id:number
    Name: string,
    Description:string
}

export interface ModuleC {
  id?: number;
  Name: string;
  Description: string;
}

export interface ModuleList{
    id:number
    name: string,
    description:string
    IsDeleted:boolean

}
