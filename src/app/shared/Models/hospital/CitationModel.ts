export interface Citation{
    id: number,
    date: string | number | Date;
    state: string,
    note: string,
    creationDate: string,
    isDeleted: boolean,
    registrationDate: string
}

export interface CitationList {
  id: number;
  isDeleted: boolean;
  registrationDate: Date;

  state: string;
  note: string;
  appointmentDate: Date;
  timeBlock: string | null; // en C# es TimeSpan?, en TS lo manejas como string o null
  scheduleHourId: number;

  nameDoctor: string;
  consultingRoomName: string;
  roomNumber: number;
}
