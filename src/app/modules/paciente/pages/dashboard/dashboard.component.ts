import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';

type Stat = { icon: string; label: string; value: number; color?: string };
type NewsItem = {
  title: string;
  date: string;
  text: string;
  status: 'pendiente' | 'confirmada';
};
type TipoCita = { icon: string; label: string; color: string };

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatBadgeModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  // ===== Topbar =====
  query = '';

  // ===== Stats superiores =====
  stats: Stat[] = [
    { icon: 'event', label: 'Mis citas', value: 18, color: '#ff6b6b' },
    { icon: 'groups', label: 'Familia', value: 6, color: '#7c4dff' },
    { icon: 'notifications', label: 'Novedades', value: 18, color: '#ffb300' },

  ];

  // ===== Tipos de cita =====
  tipos: TipoCita[] = [
    { icon: 'person_outline', label: 'Consulta', color: '#8ecae6' },
    { icon: 'clean_hands', label: 'Odontología', color: '#cdb4db' },
    { icon: 'child_friendly', label: 'Pediatría', color: '#a3d2ca' },
    { icon: 'female', label: 'Citología', color: '#f8ad9d' },
    { icon: 'vaccines', label: 'Vacunación', color: '#84dccf' },
    { icon: 'psychology', label: 'Psicología', color: '#bde0fe' },
    { icon: 'accessibility', label: 'Fisioterapia', color: '#f7b267' },
    { icon: 'visibility', label: 'Optometría', color: '#ffd6a5' },
  ];

  // ===== Novedades =====
  novedades: NewsItem[] = [
    {
      title: 'Cita pendiente',
      date: '02 Oct, 2025',
      text: 'Hola, María Torres: su cita de odontología es el 02 de octubre de 2025 a las 10:30 a.m. Recuerde asistir puntualmente o reprogramar si es necesario.',
      status: 'pendiente',
    },
    {
      title: 'Cita pendiente',
      date: '02 Oct, 2025',
      text: 'Control general con Medicina Interna. Lleve resultados de laboratorio.',
      status: 'pendiente',
    },
  ];

  // ===== Calendario simple (sin librerías) =====
  today = new Date();
  currentYear = signal(this.today.getFullYear());
  currentMonth = signal(this.today.getMonth()); // 0..11
  selected = signal(
    new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate()
    )
  );

  monthName = computed(() =>
    new Date(this.currentYear(), this.currentMonth(), 1).toLocaleDateString(
      'es-CO',
      { month: 'long', year: 'numeric' }
    )
  );

  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  get monthMatrix(): (Date | null)[] {
    const y = this.currentYear();
    const m = this.currentMonth();
    const first = new Date(y, m, 1);
    const startIndex = first.getDay(); // 0..6
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startIndex; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }

  prevMonth() {
    const m = this.currentMonth();
    const y = this.currentYear();
    if (m === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(y - 1);
    } else {
      this.currentMonth.set(m - 1);
    }
  }
  nextMonth() {
    const m = this.currentMonth();
    const y = this.currentYear();
    if (m === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(y + 1);
    } else {
      this.currentMonth.set(m + 1);
    }
  }
  isToday(d?: Date | null) {
    if (!d) return false;
    const t = this.today;
    return (
      d.getFullYear() === t.getFullYear() &&
      d.getMonth() === t.getMonth() &&
      d.getDate() === t.getDate()
    );
  }
  isSelected(d?: Date | null) {
    if (!d) return false;
    const s = this.selected();
    return (
      d.getFullYear() === s.getFullYear() &&
      d.getMonth() === s.getMonth() &&
      d.getDate() === s.getDate()
    );
  }
  pick(d?: Date | null) {
    if (d) this.selected.set(d);
  }

  // ===== Acciones UI =====
  doSearch() {
    console.log('Buscar:', this.query);
  }
  openTipo(t: TipoCita) {
    console.log('Elegido tipo:', t.label);
  }
  verTodo() {
    console.log('Ver todas las novedades');
  }
}
