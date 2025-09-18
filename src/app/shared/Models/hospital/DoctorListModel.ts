export interface DoctorList {
    id: number,
    specialtyId: number,
    specialtyName: string,
    active: boolean,
    image: string,
    fullName: string | null,
    emailDoctor: string,
    isDeleted: boolean,
    registrationDate: Date,
    personId?: number
}

export interface DoctorCitation {
  state: string;
  note: string;
  appointmentDate: string;       // ISO (fecha)
  timeBlock: string;              // "HH:mm:ss"
  scheduleHourId: number;
  nameDoctor: string | null;
  consultingRoomName: string;
  roomNumber: number;
  id: number;
  isDeleted: boolean;
  registrationDate: string;
  patientName?: string | null;
  patientId?: number;
}