import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

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
  leida: boolean; // derivado de stateNotification
}

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
  imports: [CommonModule, MatIconModule],
})
export class NotificacionesComponent implements OnInit, OnDestroy {
  tab: Tab = 'todas';
  notificaciones: NotificacionUI[] = [];
  cargando = false;
  accionando = new Set<number>();

  /** Flag para evitar ejecutar el marcado múltiple más de una vez simultánea */
  private marcandoSalida = false;

  constructor(private api: NotificationService) {}

  // ========= Ciclo de vida =========
  ngOnInit(): void {
    this.cargar();
  }

  /** Si el usuario abandona el componente estando en "no-leídas", también marcamos al salir */
  ngOnDestroy(): void {
    if (this.tab === 'no-leidas') {
      this.marcarTodasNoLeidasComoLeidas();
    }
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

  // ========= Tabs =========
  setTab(t: Tab) {
    // Si estamos en "no-leídas" y vamos a otra pestaña, primero marcamos todas como leídas
    if (this.tab === 'no-leidas' && t !== 'no-leidas') {
      this.marcarTodasNoLeidasComoLeidas(() => {
        this.tab = t;
      });
    } else {
      this.tab = t;
    }
  }

  // ========= Marcado al salir de "no-leídas" =========
  /** Marca en backend todas las no leídas (UI optimista + forkJoin para paraleo) */
  private marcarTodasNoLeidasComoLeidas(onDone?: () => void): void {
    if (this.marcandoSalida) {
      onDone?.();
      return;
    }

    const pendientes = this.notificaciones.filter((n) => !n.leida);
    if (!pendientes.length) {
      onDone?.();
      return;
    }

    this.marcandoSalida = true;

    const ids = pendientes.map((n) => n.id);

    // (1) UI optimista
    this.notificaciones = this.notificaciones.map((n) =>
      ids.includes(n.id) ? { ...n, leida: true, estado: 'Realizada' } : n
    );

    // (2) PATCH en paralelo (usa tu NotificationService.markAsRead(id))
    const reqs = ids.map((id) => this.api.markAsRead(id));
    forkJoin(reqs).subscribe({
      next: () => {},
      error: () => {
        // (3) Rollback si falla algo
        this.notificaciones = this.notificaciones.map((n) =>
          ids.includes(n.id) ? { ...n, leida: false, estado: 'Pendiente' } : n
        );
      },
      complete: () => {
        this.marcandoSalida = false;
        onDone?.();
      },
    });
  }

  // ========= Mapeo y helpers =========
  private mapToUI(n: NotificationList): NotificacionUI {
    const leida = !!n.stateNotification;
    const fecha = n.createdAt ? new Date(n.createdAt).toLocaleString() : '—';

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

  // ========= Filtros y contadores (para tu template) =========
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

  // ========= Acciones individuales (opcional) =========
  marcarLeida(n: NotificacionUI, valor: boolean): void {
    if (this.accionando.has(n.id)) return;
    this.accionando.add(n.id);

    const prev = n.leida;
    n.leida = valor;
    n.estado = valor ? 'Realizada' : 'Pendiente';

    const req = valor ? this.api.markAsRead(n.id) : this.api.markAsUnread(n.id);
    req.subscribe({
      next: () => {},
      error: () => {
        n.leida = prev;
        n.estado = prev ? 'Realizada' : 'Pendiente';
      },
      complete: () => this.accionando.delete(n.id),
    });
  }

  eliminarNotificacion(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta notificación?')) return;
    this.api.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: (err: unknown) =>
        console.error('Error al eliminar notificación:', err),
    });
  }
}
