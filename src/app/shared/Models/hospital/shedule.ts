
export interface shedule{
  id: number;                  // Id de la cita
  IcontypeCitation : string
  typeCitationName: string;    // Nombre del tipo de cita (ej: "Odontología")
  nameDoctor: string | null;   // Nombre del doctor (puede ser null)
  consultingRoomName: string;  // Nombre del consultorio (ej: "Pediatría")
  numberCitation: number;      // Número de la cita
  roomNumber: number;          
}


// interfaces/consulting-room.interface.ts
export interface ConsultingRoom {
  id: number;
  name: string;
  roomNumber: number;
  floor: number;
  isDeleted: boolean;
  registrationDate: Date;
}