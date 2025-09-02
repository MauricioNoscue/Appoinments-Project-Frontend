import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceBaseService } from '../services/base/service-base.service';
import {
  NotificationList,
  NotificationCreate,
  NotificationEdit,
} from '../Models/Notification/Notification';

@Injectable({ providedIn: 'root' })
export class NotificationService extends ServiceBaseService<
  NotificationList,
  NotificationCreate,
  NotificationEdit
> {
  constructor() {
    super('notification'); // asegúrate que tu backend sea /api/notification
  }

  // ✅ Ahora usamos PATCH al endpoint específico
  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.urlBase}/${id}/state`, {
      stateNotification: true,
    });
  }

  markAsUnread(id: number): Observable<void> {
    return this.http.patch<void>(`${this.urlBase}/${id}/state`, {
      stateNotification: false,
    });
  }
}
