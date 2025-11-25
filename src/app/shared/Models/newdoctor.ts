export interface CitationList {
  id: number;
  isDeleted: boolean;
  registrationDate: Date | string | null;

  statustypesId: number;
  statustypesName: string;

  note: string;
  appointmentDate: string;      // ISO date
  timeBlock: string | null;     // HH:mm:ss

  scheduleHourId: number;
  doctorId: number;

  nameDoctor: string;
  patientName: string;

  consultingRoomName: string;
  roomNumber: number;

  reltedPersonId?: number | null;
}

// shared/Models/hospital/SheduleModel.ts
  export interface SheduleList {
  id: number;
  isDeleted: boolean;
  registrationDate: string | null;

  typeCitationName: string;
  nameDoctor: string;
  consultingRoomName: string;

  numberCitation: number;
  roomNumber: number;
}