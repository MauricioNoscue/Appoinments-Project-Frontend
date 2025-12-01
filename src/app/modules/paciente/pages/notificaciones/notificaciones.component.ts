import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../../../shared/services/notification.service';
import { NotificationList } from '../../../../shared/Models/Notification/Notification';

type Estado = 'Enviada' | 'Leída';
type Tab = 'todas' | 'no-leidas' | 'leidas';

interface NotificacionUI {
  id: number;
  mensaje: string;
  fecha: string;
  tipo: string;
  estado: Estado;
  icono: string;
  leida: boolean;
}

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
  imports: [CommonModule, MatIconModule],
})
export class NotificacionesComponent implements OnInit {

   @Input() realTimeNotification: any | null = null;
  tab: Tab = 'todas';
  notificaciones: NotificacionUI[] = [];
  cargando = false;
  accionando = new Set<number>();

  constructor(private api: NotificationService) {}

  ngOnInit(): void {
    this.cargar();
  }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['realTimeNotification'] && this.realTimeNotification) {
      const n = this.mapToUI(this.realTimeNotification);

      // Agregar la notificación arriba en tiempo real
      this.notificaciones.unshift(n);
    }
  }
  // ===========================
  // CARGAR DATOS
  // ===========================
  private cargar(): void {
    this.cargando = true;

    this.api.GetAllUser().subscribe({
      next: (data: NotificationList[]) => {
        // Mapeo + MÍMICA
        this.notificaciones = data.map((n) => this.mapToUI(n));
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }

  // ===========================
  // CAMBIAR TAB
  // ===========================
  setTab(t: Tab): void {
    this.tab = t;
  }

  // ===========================
  // MAPEAR A UI
  // ===========================
  private mapToUI(n: NotificationList): NotificacionUI {
    // ESTADO REAL
    const estado: Estado = n.statustypesId === 6 ? 'Leída' : 'Enviada';

    // LEÍDA (solo si status = 6)
    const leida = estado === 'Leída';

    return {
      id: n.id,
      mensaje: n.message,
      fecha: n.RegistrationDate ? new Date(n.RegistrationDate).toLocaleString() : '—',
      tipo:  'Notificación',
      estado,
      icono:
        n.typeNotification === 1
          ? 'settings'
          : n.typeNotification === 2
          ? 'alarm'
          : n.typeNotification === 3
          ? 'warning'
          : 'info',
      leida,
    };
  }

  // ===========================
  // FILTROS
  // ===========================
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

  // ===========================
  // ELIMINAR
  // ===========================
  eliminarNotificacion(id: number): void {
    if (!confirm('¿Eliminar notificación?')) return;

    this.api.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: () => {},
    });
  }
}
