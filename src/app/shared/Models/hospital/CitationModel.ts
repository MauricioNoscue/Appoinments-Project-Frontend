export interface Citation{
    id: number,
    date: string | number | Date;
    state: string,
    note: string,
    creationDate: string,
    isDeleted: boolean,
    registrationDate: string,
    doctorId?: number // Campo opcional para filtrar por doctor
}