
export interface shedule{
  id: number;                  // Id de la cita
  IcontypeCitation : string
  typeCitationName: string;    // Nombre del tipo de cita (ej: "Odontología")
  nameDoctor: string | null;   // Nombre del doctor (puede ser null)
  consultingRoomName: string;  // Nombre del consultorio (ej: "Pediatría")
  numberCitation: number;      // Número de la cita
  roomNumber: number;          
}
