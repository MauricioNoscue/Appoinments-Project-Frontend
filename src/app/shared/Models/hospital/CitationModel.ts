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

export interface CitationList {
  id: number;
  isDeleted: boolean;
  registrationDate: Date;
  statustypesName : string;
  statustypesId: number;
  note: string;
  appointmentDate: Date;
  timeBlock: string | null; // en C# es TimeSpan?, en TS lo manejas como string o null
  scheduleHourId: number;
  doctorId: number;
  nameDoctor: string;
  consultingRoomName: string;
  roomNumber: number;
}
