// consulting-room.service.ts
import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import {
  ConsultingRoomList,
  ConsultingRoomCreate,
  ConsultingRoomUpdate,
} from '../Models/ConsultingRoom/ConsultingRoom';

@Injectable({ providedIn: 'root' })
export class ConsultingRoomService extends ServiceBaseService<
  ConsultingRoomList,
  ConsultingRoomCreate,
  ConsultingRoomUpdate
> {
  constructor() {
    super('ConsultingRoom');
  }

  eliminarLogico(id: number) {
    return this.http.patch(`${this.urlBase}/logic/${id}`, {});
  }
}
