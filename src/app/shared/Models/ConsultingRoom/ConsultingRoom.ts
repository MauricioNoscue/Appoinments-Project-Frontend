export interface ConsultingRoomList {
  id: number;
  isDeleted: boolean;
  registrationDate: Date;
  branchId: number;
  name: string;
  roomNumber: number;
  floor: number;
  // branchName: string; // nombre de la sucursal relacionada
}

export interface ConsultingRoomCreate {
  branchId: number;
  name: string;
  roomNumber: number;
  floor: number;
}

export interface ConsultingRoomUpdate {
  id?: number;
  branchId: number;
  name: string;
  roomNumber: number;
  floor: number;
}

export interface ConsultingRoom {
  id?: number;
  isDeleted?: boolean;
  registrationDate?: Date;
  branchId: number;
  name: string;
  roomNumber: number;
  floor: number;
  branchName?: string;
}

export interface GenericService {
  id?: number;
  branchId: number;
  name: string;
  roomNumber: number;
  floor: number;
}
