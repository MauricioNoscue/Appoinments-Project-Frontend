import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // *ngFor, *ngIf, [ngClass]
import { MatIconModule } from '@angular/material/icon'; // <mat-icon>
import { NotificationService } from '../../../../shared/services/notification.service';
import { NotificationList } from '../../../../shared/Models/Notification/Notification';

type Estado =
  | 'Confirmada'
  | 'Pendiente'
  | 'Cancelada'
  | 'Reagendada'
  | 'Realizada';
type Tab = 'todas' | 'no-leidas' | 'leidas';

interface NotificacionUI {
  id: number;
  mensaje: string;
  fecha: string;
  tipo: string;
  estado: Estado;
  icono: string;
  leida: boolean; // derivado de stateNotification (bool)
}

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
  imports: [CommonModule, MatIconModule],
})
export class NotificacionesComponent implements OnInit {
  tab: Tab = 'todas';
  notificaciones: NotificacionUI[] = [];
  cargando = false;
  accionando = new Set<number>(); // IDs en acción para deshabilitar botones

  constructor(private api: NotificationService) {}

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando = true;
    this.api.traerTodo().subscribe({
      next: (data: NotificationList[]) => {
        this.notificaciones = data.map((n) => this.mapToUI(n));
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      },
    });
  }

  private mapToUI(n: NotificationList): NotificacionUI {
    // AHORA ES BOOLEANO
    const leida = !!n.stateNotification;
    const fecha = n.createdAt ? new Date(n.createdAt).toLocaleString() : '—';

    // typeNotification puede venir undefined/null -> manejar seguro
    const icono =
      n.typeNotification === 'ALERT'
        ? 'warning'
        : n.typeNotification === 'WARNING'
        ? 'priority_high'
        : n.typeNotification === 'SYSTEM'
        ? 'settings'
        : 'notifications';

    const estado: Estado = leida ? 'Realizada' : 'Pendiente';

    return {
      id: n.id,
      mensaje: n.message,
      fecha,
      tipo: n.typeCitationName || n.citation || 'Cita',
      estado,
      icono,
      leida,
    };
  }

  // ====== Filtros y contadores ======
  get filtered(): NotificacionUI[] {
    if (this.tab === 'no-leidas')
      return this.notificaciones.filter((n) => !n.leida);
    if (this.tab === 'leidas')
      return this.notificaciones.filter((n) => n.leida);
    return this.notificaciones;
  }
  get unreadCount(): number {
    return this.notificaciones.filter((n) => !n.leida).length;
  }
  get readCount(): number {
    return this.notificaciones.filter((n) => n.leida).length;
  }
  setTab(t: Tab) {
    this.tab = t;
  }

  // ====== Leído / No leído (PERSISTE EN BD) ======
  marcarLeida(n: NotificacionUI, valor: boolean): void {
    if (this.accionando.has(n.id)) return; // evita doble click
    this.accionando.add(n.id);

    // --- 1) Optimista: actualiza UI de inmediato
    const prev = n.leida;
    n.leida = valor;
    n.estado = valor ? 'Realizada' : 'Pendiente';

    // --- 2) Persiste en backend
    const req = valor ? this.api.markAsRead(n.id) : this.api.markAsUnread(n.id);
    req.subscribe({
      // Si quieres, puedes NO recargar para mantener el cambio instantáneo.
      // next: () => {},

      // O si prefieres garantizar sincronía, recarga desde BD:
      next: () => this.cargar(),

      error: () => {
        // --- 3) Reversión si falla
        n.leida = prev;
        n.estado = prev ? 'Realizada' : 'Pendiente';
        this.accionando.delete(n.id);
      },
      complete: () => this.accionando.delete(n.id),
    });
  }

  // ====== Eliminar (heredado del base) ======
  eliminarNotificacion(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta notificación?')) return;
    this.api.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: (err: unknown) =>
        console.error('Error al eliminar notificación:', err),
    });
  }
}
