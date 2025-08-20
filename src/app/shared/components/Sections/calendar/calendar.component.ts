// calendar.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreCitationService } from '../../../services/Hospital/core-citation.service';

interface CalendarDay {
  day: number;
  dayName: string;
  isToday: boolean;
  isCurrentMonth: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'] // 👈 (ojo: plural)
})
export class CalendarComponent implements OnInit {

  @Input() idTypeCitation: number = 0;
  @Input() todos: boolean = true;

  // 👉 Eventos hacia el padre
  @Output() dateChange = new EventEmitter<string>();
  @Output() blocksLoaded = new EventEmitter<any[]>(); // pon tu interfaz si la tienes

  constructor(private service: CoreCitationService) {}

  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  today: Date = new Date();
  selectedDay: number | null = null;

  visibleDays: CalendarDay[] = [];

  dayNames: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  monthNames: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  ngOnInit(): void {
    this.generateVisibleDays();
    this.loadBlocks(this.today); // Al iniciar (hoy)
  }

  private loadBlocks(date: Date): void {
    const formatted = this.formatDate(date);
    this.dateChange.emit(formatted); // 🔔 informa fecha seleccionada/consultada

    this.service.getAvailableBlocks(this.idTypeCitation, formatted, this.todos).subscribe({
      next: (res) => {
        console.log('Bloques disponibles:', res);
        this.blocksLoaded.emit(res); // 🔔 envía los datos al padre
      },
      error: (err) => console.error('Error al cargar bloques:', err)
    });
  }

  private formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  generateVisibleDays(): void {
    this.visibleDays = [];

    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);

    let startDay = 1;
    const currentMonthYear =
      this.currentMonth === this.today.getMonth() &&
      this.currentYear === this.today.getFullYear();

    if (currentMonthYear) startDay = this.today.getDate();

    for (let day = startDay; day <= lastDayOfMonth.getDate(); day++) {
      const currentDate = new Date(this.currentYear, this.currentMonth, day);
      const dayOfWeek = currentDate.getDay();
      const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      const isToday = currentDate.toDateString() === this.today.toDateString();
      const isSelected = this.selectedDay === day;

      this.visibleDays.push({
        day,
        dayName: this.dayNames[adjustedDayOfWeek],
        isToday,
        isCurrentMonth: true,
        isSelected
      });
    }
  }

  previousMonth(): void {
    if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; }
    else { this.currentMonth--; }
    this.selectedDay = null;
    this.generateVisibleDays();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; }
    else { this.currentMonth++; }
    this.selectedDay = null;
    this.generateVisibleDays();
  }

  selectDay(day: number): void {
    this.selectedDay = day;
    const selectedDate = new Date(this.currentYear, this.currentMonth, day);

    console.log('Fecha seleccionada:', this.formatDate(selectedDate));

    this.generateVisibleDays();
    this.loadBlocks(selectedDate); // 🔁 vuelve a cargar y emite al padre
  }

  getMonthName(): string {
    return this.monthNames[this.currentMonth];
  }
}
