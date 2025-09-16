export interface ConsultingRoomList {
  id: number;
  isDeleted: boolean;
  registrationDate: Date;
  branchId: number;
  name: string;
  roomNumber: number;
  floor: number;
  image?: string;
}

export interface ConsultingRoomCreate {
  branchId: number;
  name: string;
  roomNumber: number;
  floor: number;
  image?: string;
}

export interface ConsultingRoomUpdate {
  id?: number;
  branchId: number;
  name: string;
  roomNumber: number;
  floor: number;
  image?: string;
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
  image?: string;
}

export interface GenericService {
  id?: number;
  branchId: number;
  name: string;
  roomNumber: number;
  floor: number;
  image?: string;
}
