import { Component, OnInit } from '@angular/core';
import { AppointmentStatus, ChartItem, DashboardStats, StaffMember } from '../../../../shared/Models/dashboard/dashboard.model';
import { DashboardFacadeService } from '../../../../shared/services/DashboardService';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-admin',
  standalone: false,
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {
  // UI
  fechaActual = new Date();
  usuarioActual = 'Administrador'; // luego lo tomas de AuthService

  stats$!: Observable<DashboardStats>;
  appointmentStatus$!: Observable<AppointmentStatus>;
  chartItems$!: Observable<ChartItem[]>;
  staff$!: Observable<StaffMember[]>;

  constructor(private facade: DashboardFacadeService) { }

  ngOnInit(): void {
    this.stats$ = this.facade.stats$;
    this.appointmentStatus$ = this.facade.appointmentStatus$;
    this.chartItems$ = this.facade.yearBehavior$;
    this.staff$ = this.facade.staff$;
  }
  totalChartItems(items: { value: number }[]): number {
    return items.reduce((acc, i) => acc + i.value, 0);
  }


  // Exportar (opcional, lo dejamos listo si lo quieres)
  exportarYearBehavior(items: ChartItem[]): void {
    import('xlsx').then((XLSX: typeof import('xlsx')) => {
      import('file-saver').then(({ saveAs }) => {
        const ws = XLSX.utils.json_to_sheet(items);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Comportamiento');
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, `comportamiento-${new Date().toISOString().slice(0, 10)}.xlsx`);
      });
    });
  }
}