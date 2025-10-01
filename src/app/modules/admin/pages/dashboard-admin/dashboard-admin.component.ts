import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AppointmentStatus, ChartItem, DashboardStats, StaffMember, DashboardDto } from '../../../../shared/Models/dashboard/dashboard.model';
import { DashboardFacadeService } from '../../../../shared/services/DashboardService';
import { Observable, map } from 'rxjs';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-dashboard-admin',
  standalone: false,
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit, AfterViewInit, OnDestroy {
  // UI
  fechaActual = new Date();
  usuarioActual = 'Administrador'; // luego lo tomas de AuthService

  dashboard$!: Observable<DashboardDto | null>;

  // Mapeados desde dashboard$
  citasPorSemana$!: Observable<number>;
  citasPorEspecialidad$!: Observable<{ specialty: string; count: number }[]>;
  pacientesNuevos$!: Observable<{ fecha: string; cantidad: number }[]>;
  pacientesActivosInactivos$!: Observable<{ activos: number; inactivos: number }>;
  doctoresMasCitas$!: Observable<{ nombreDoctor: string; citasAtendidas: number }[]>;
  disponibilidadDoctores$!: Observable<{ nombreDoctor: string; cuposLibres: number }[]>;
  rankingEspecialidades$!: Observable<{ specialty: string; count: number }[]>;
  tasaAsistencia$!: Observable<number>;
  tiempoPromedioEspera$!: Observable<number>;
  graficaBarrasTipoCita$!: Observable<ChartItem[]>;
  graficaTortaEstados$!: Observable<ChartItem[]>;
  rankingDoctores$!: Observable<ChartItem[]>;

  // Instancias de gráficas para destruirlas
  private charts: { [key: string]: Chart } = {};

  constructor(private facade: DashboardFacadeService) { }

  ngOnInit(): void {
    this.dashboard$ = this.facade.dashboard$;

    // Mapear observables desde dashboard$
    this.citasPorSemana$ = this.dashboard$.pipe(map(d => d?.citas.totalCitasSemana || 0));
    this.citasPorEspecialidad$ = this.dashboard$.pipe(map(d => d ? Object.entries(d.citas.distribucionPorEspecialidad).map(([specialty, count]) => ({ specialty, count: count as number })) : []));
    this.pacientesNuevos$ = this.dashboard$.pipe(map(d => d?.pacientes.nuevosRegistrados || []));
    this.pacientesActivosInactivos$ = this.dashboard$.pipe(map(d => d ? { activos: d.pacientes.pacientesActivos, inactivos: d.pacientes.pacientesInactivos } : { activos: 0, inactivos: 0 }));
    this.doctoresMasCitas$ = this.dashboard$.pipe(map(d => d?.doctores.topDoctores || []));
    this.disponibilidadDoctores$ = this.dashboard$.pipe(map(d => d?.doctores.doctoresDisponibles || []));
    this.rankingEspecialidades$ = this.dashboard$.pipe(map(d => d ? Object.entries(d.doctores.rankingEspecialidades).map(([specialty, count]) => ({ specialty, count: count as number })) : []));
    this.tasaAsistencia$ = this.dashboard$.pipe(map(d => d?.kpis.tasaAsistencia || 0));
    this.tiempoPromedioEspera$ = this.dashboard$.pipe(map(d => d?.kpis.tiempoPromedioEspera || 0));

    // Para gráficas
    this.graficaBarrasTipoCita$ = this.citasPorEspecialidad$.pipe(map(data => data.map((s, i) => ({
      label: s.specialty,
      value: s.count,
      percent: 0,
      color: this.palette[i % this.palette.length]
    }))));
    this.graficaTortaEstados$ = this.dashboard$.pipe(map(d => d ? [
      { label: 'Pendiente', value: d.citas.estadosCitas['Pendiente'] || 0, percent: 0, color: '#007bff' },
      { label: 'Atendida', value: d.citas.estadosCitas['Atendida'] || 0, percent: 0, color: '#28a745' },
      { label: 'Cancelada', value: d.citas.estadosCitas['Cancelada'] || 0, percent: 0, color: '#dc3545' }
    ] : []));
    this.rankingDoctores$ = this.doctoresMasCitas$.pipe(map(data => data.map((d, i) => ({
      label: d.nombreDoctor,
      value: d.citasAtendidas,
      percent: 0,
      color: this.palette[i % this.palette.length]
    }))));

    // Cargar datos iniciales
    this.facade.loadDashboardData();
  }

  private readonly palette = ['#17a2b8', '#007bff', '#6f42c1', '#e83e8c', '#fd7e14', '#ffc107', '#20c997', '#6610f2', '#28a745', '#dc3545', '#6c757d', '#343a40'];

  ngAfterViewInit(): void {
    this.createCharts();
  }

  ngOnDestroy(): void {
    // Destruir todas las gráficas al destruir el componente
    Object.values(this.charts).forEach(chart => chart.destroy());
  }

  private createCharts(): void {
    // Función helper para crear o actualizar gráfica
    const createOrUpdateChart = (chartId: string, config: any) => {
      const ctx = document.getElementById(chartId) as HTMLCanvasElement;
      if (ctx) {
        // Destruir gráfica anterior si existe
        if (this.charts[chartId]) {
          this.charts[chartId].destroy();
        }
        // Crear nueva gráfica
        this.charts[chartId] = new Chart(ctx, config);
      }
    };

    // Gráfica de especialidades
    this.citasPorEspecialidad$.subscribe(data => {
      createOrUpdateChart('especialidadChart', {
        type: 'bar',
        data: {
          labels: data.map(d => d.specialty),
          datasets: [{
            label: 'Citas',
            data: data.map(d => d.count),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          }]
        }
      });
    });

    // Gráfica de pacientes nuevos
    this.pacientesNuevos$.subscribe(data => {
      createOrUpdateChart('pacientesChart', {
        type: 'line',
        data: {
          labels: data.map(d => d.fecha),
          datasets: [{
            label: 'Nuevos Pacientes',
            data: data.map(d => d.cantidad),
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false
          }]
        }
      });
    });

    // Gráfica barras tipo cita
    this.graficaBarrasTipoCita$.subscribe(data => {
      createOrUpdateChart('barrasChart', {
        type: 'bar',
        data: {
          labels: data.map(d => d.label),
          datasets: [{
            label: 'Citas',
            data: data.map(d => d.value),
            backgroundColor: data.map(d => d.color)
          }]
        }
      });
    });

    // Gráfica línea evolución de pacientes nuevos
    this.pacientesNuevos$.subscribe(data => {
      createOrUpdateChart('lineaChart', {
        type: 'line',
        data: {
          labels: data.map(d => d.fecha),
          datasets: [{
            label: 'Nuevos Pacientes',
            data: data.map(d => d.cantidad),
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false
          }]
        }
      });
    });

    // Gráfica torta estados
    this.graficaTortaEstados$.subscribe(data => {
      createOrUpdateChart('tortaChart', {
        type: 'pie',
        data: {
          labels: data.map(d => d.label),
          datasets: [{
            data: data.map(d => d.value),
            backgroundColor: data.map(d => d.color)
          }]
        }
      });
    });

    // Gráfica ranking doctores
    this.rankingDoctores$.subscribe(data => {
      createOrUpdateChart('rankingChart', {
        type: 'bar',
        data: {
          labels: data.map(d => d.label),
          datasets: [{
            label: 'Pacientes Atendidos',
            data: data.map(d => d.value),
            backgroundColor: data.map(d => d.color)
          }]
        }
      });
    });
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