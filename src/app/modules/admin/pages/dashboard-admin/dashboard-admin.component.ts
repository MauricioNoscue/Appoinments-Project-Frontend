import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AppointmentStatus, ChartItem, DashboardStats, StaffMember, DashboardDto, StaffStatus } from '../../../../shared/Models/dashboard/dashboard.model';
import { DashboardFacadeService } from '../../../../shared/services/DashboardService';
import { DoctorService } from '../../../../shared/services/doctor.service';
import { Observable, map, of, shareReplay } from 'rxjs';
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
  allDoctors$!: Observable<any[]>; // Para obtener todos los doctores

  // Properties for HTML template
  stats$!: Observable<DashboardStats>;
  appointmentStatus$!: Observable<AppointmentStatus>;
  chartItems$!: Observable<ChartItem[]>;
  staff$!: Observable<StaffMember[]>;

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

  // Modal states - completamente independientes
  showAllDoctorsModal = false;
  showDoctorProfileModal = false;
  showDoctorAgendaModal = false;

  // Datos separados para cada modal
  selectedDoctorForProfile: any = null;
  selectedDoctorForAgenda: any = null;
  doctorCitations: any[] = [];
  loadingCitations = false;

  // Instancias de gráficas para destruirlas
  private charts: { [key: string]: Chart } = {};

  constructor(private facade: DashboardFacadeService, private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.dashboard$ = this.facade.dashboard$;
    this.allDoctors$ = this.doctorService.traerDoctorPersona2().pipe(
      map(doctors => {
        console.log('Raw doctors data from service (traerDoctorPersona2):', doctors);
        return doctors || [];
      }),
      shareReplay(1)
    );

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
      { label: 'Pendiente', value: d.citas.estadosCitas['pendiente'] || 0, percent: 0, color: '#007bff' },
      { label: 'Atendida', value: d.citas.estadosCitas['atendida'] || 0, percent: 0, color: '#28a745' },
      { label: 'Cancelada', value: d.citas.estadosCitas['cancelada'] || 0, percent: 0, color: '#dc3545' }
    ] : []));
    this.rankingDoctores$ = this.doctoresMasCitas$.pipe(map(data => data.map((d, i) => ({
      label: d.nombreDoctor,
      value: d.citasAtendidas,
      percent: 0,
      color: this.palette[i % this.palette.length]
    }))));

    // Map properties for HTML template
    this.stats$ = this.dashboard$.pipe(map(d => d ? {
      totalCitasAnio: d.citas.totalCitasMes * 12, // placeholder
      totalCitasMes: d.citas.totalCitasMes,
      totalCitasDia: d.citas.totalCitasDia,
      totalUsuarios: d.pacientes.pacientesActivos + d.pacientes.pacientesInactivos,
      variationYear: 0,
      variationMonth: 0,
      variationDay: 0
    } : {
      totalCitasAnio: 0,
      totalCitasMes: 0,
      totalCitasDia: 0,
      totalUsuarios: 0,
      variationYear: 0,
      variationMonth: 0,
      variationDay: 0
    }));

    this.appointmentStatus$ = this.dashboard$.pipe(map(d => d ? {
      total: Object.values(d.citas.estadosCitas).reduce((a, b) => a + b, 0),
      scheduled: d.citas.estadosCitas['pendiente'] || 0,
      completed: d.citas.estadosCitas['atendida'] || 0,
      canceled: d.citas.estadosCitas['cancelada'] || 0
    } : {
      total: 0,
      scheduled: 0,
      completed: 0,
      canceled: 0
    }));

    this.chartItems$ = this.graficaTortaEstados$;

    this.staff$ = this.allDoctors$.pipe(
      map(doctors => {
        console.log('Doctors data for staff:', doctors);
        return doctors.map((d, i) => {
          const fullName = d.fullName?.trim();
          const specialty = d.specialtyName?.trim() || 'Sin especialidad';

          // Si fullName está vacío o solo contiene "Doctor", usar un nombre más descriptivo
          let displayName = fullName;
          if (!fullName || fullName === '' || fullName.toLowerCase() === 'doctor') {
            displayName = `Doctor ${d.id}`;
          }

          console.log(`Doctor ${i}:`, { id: d.id, originalFullName: d.fullName, displayName, specialty, active: d.active });
          return {
            id: d.id,
            fullName: displayName,
            specialty: specialty,
            status: d.active ? 'activo' : 'inactivo' as StaffStatus,
            color: this.palette[i % this.palette.length]
          };
        });
      })
    );

    // Cargar datos iniciales
    this.facade.loadDashboardData();

    // Debug: verificar que los datos llegan
    this.dashboard$.subscribe(data => {
      console.log('Dashboard data received:', data);
      if (data) {
        console.log('Real data received, charts will update automatically');
      } else {
        console.log('No data received, using mock data for charts');
        // Usar datos mock para testing
        setTimeout(() => this.createMockCharts(), 500);
      }
    });
  }

  private readonly palette = ['#17a2b8', '#007bff', '#6f42c1', '#e83e8c', '#fd7e14', '#ffc107', '#20c997', '#6610f2', '#28a745', '#dc3545', '#6c757d', '#343a40'];

  ngAfterViewInit(): void {
    // Esperar un poco para que el DOM esté completamente renderizado
    setTimeout(() => {
      this.createCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    // Destruir todas las gráficas al destruir el componente
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
    this.charts = {};
  }

  private createCharts(): void {
    console.log('Creating charts...');

    // Función helper para crear o actualizar gráfica
    const createOrUpdateChart = (chartId: string, config: any) => {
      try {
        const ctx = document.getElementById(chartId) as HTMLCanvasElement;
        if (!ctx) {
          console.warn(`Canvas element with id '${chartId}' not found`);
          return;
        }

        console.log(`Creating chart for ${chartId}`, config);

        // Destruir gráfica anterior si existe
        if (this.charts[chartId]) {
          this.charts[chartId].destroy();
        }

        // Crear nueva gráfica
        this.charts[chartId] = new Chart(ctx, config);
        console.log(`Chart created successfully for ${chartId}`);
      } catch (error) {
        console.error(`Error creating chart for ${chartId}:`, error);
      }
    };

    // Gráfica de especialidades
    this.citasPorEspecialidad$.subscribe(data => {
      console.log('Especialidades data:', data);
      if (data && data.length > 0) {
        createOrUpdateChart('especialidadChart', {
          type: 'bar',
          data: {
            labels: data.map(d => d.specialty),
            datasets: [{
              label: 'Citas',
              data: data.map(d => d.count),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    });

    // Gráfica de pacientes nuevos
    this.pacientesNuevos$.subscribe(data => {
      console.log('Pacientes nuevos data:', data);
      if (data && data.length > 0) {
        createOrUpdateChart('pacientesChart', {
          type: 'line',
          data: {
            labels: data.map(d => d.fecha),
            datasets: [{
              label: 'Nuevos Pacientes',
              data: data.map(d => d.cantidad),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    });

    // Gráfica barras tipo cita
    this.graficaBarrasTipoCita$.subscribe(data => {
      console.log('Barras tipo cita data:', data);
      if (data && data.length > 0) {
        createOrUpdateChart('barrasChart', {
          type: 'bar',
          data: {
            labels: data.map(d => d.label),
            datasets: [{
              label: 'Citas',
              data: data.map(d => d.value),
              backgroundColor: data.map(d => d.color),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    });

    // Gráfica línea evolución de pacientes nuevos
    this.pacientesNuevos$.subscribe(data => {
      console.log('Línea pacientes data:', data);
      if (data && data.length > 0) {
        createOrUpdateChart('lineaChart', {
          type: 'line',
          data: {
            labels: data.map(d => d.fecha),
            datasets: [{
              label: 'Nuevos Pacientes',
              data: data.map(d => d.cantidad),
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: false,
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    });

    // Gráfica torta estados
    this.graficaTortaEstados$.subscribe(data => {
      console.log('Torta estados data:', data);
      if (data && data.length > 0) {
        createOrUpdateChart('tortaChart', {
          type: 'pie',
          data: {
            labels: data.map(d => d.label),
            datasets: [{
              data: data.map(d => d.value),
              backgroundColor: data.map(d => d.color),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    });

    // Gráfica ranking doctores
    this.rankingDoctores$.subscribe(data => {
      console.log('Ranking doctores data:', data);
      if (data && data.length > 0) {
        createOrUpdateChart('rankingChart', {
          type: 'bar',
          data: {
            labels: data.map(d => d.label),
            datasets: [{
              label: 'Pacientes Atendidos',
              data: data.map(d => d.value),
              backgroundColor: data.map(d => d.color),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    });
  }

  private createMockCharts(): void {
    console.log('Creating mock charts for testing...');

    const createOrUpdateChart = (chartId: string, config: any) => {
      try {
        const ctx = document.getElementById(chartId) as HTMLCanvasElement;
        if (!ctx) {
          console.warn(`Canvas element with id '${chartId}' not found`);
          return;
        }

        // Destruir gráfica anterior si existe
        if (this.charts[chartId]) {
          this.charts[chartId].destroy();
        }

        // Crear nueva gráfica
        this.charts[chartId] = new Chart(ctx, config);
        console.log(`Mock chart created successfully for ${chartId}`);
      } catch (error) {
        console.error(`Error creating mock chart for ${chartId}:`, error);
      }
    };

    // Mock data
    const especialidadesData = [
      { specialty: 'Cardiología', count: 45 },
      { specialty: 'Pediatría', count: 32 },
      { specialty: 'Dermatología', count: 28 },
      { specialty: 'Ginecología', count: 25 }
    ];

    const pacientesData = [
      { fecha: '2025-09-25', cantidad: 5 },
      { fecha: '2025-09-26', cantidad: 8 },
      { fecha: '2025-09-27', cantidad: 12 },
      { fecha: '2025-09-28', cantidad: 6 },
      { fecha: '2025-09-29', cantidad: 15 }
    ];

    const estadosData = [
      { label: 'Pendiente', value: 25, color: '#007bff' },
      { label: 'Atendida', value: 85, color: '#28a745' },
      { label: 'Cancelada', value: 15, color: '#dc3545' }
    ];

    // Crear gráficas con datos mock
    createOrUpdateChart('especialidadChart', {
      type: 'bar',
      data: {
        labels: especialidadesData.map(d => d.specialty),
        datasets: [{
          label: 'Citas',
          data: especialidadesData.map(d => d.count),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    createOrUpdateChart('pacientesChart', {
      type: 'line',
      data: {
        labels: pacientesData.map(d => d.fecha),
        datasets: [{
          label: 'Nuevos Pacientes',
          data: pacientesData.map(d => d.cantidad),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    createOrUpdateChart('barrasChart', {
      type: 'bar',
      data: {
        labels: especialidadesData.map(d => d.specialty),
        datasets: [{
          label: 'Citas',
          data: especialidadesData.map(d => d.count),
          backgroundColor: this.palette.slice(0, especialidadesData.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    createOrUpdateChart('lineaChart', {
      type: 'line',
      data: {
        labels: pacientesData.map(d => d.fecha),
        datasets: [{
          label: 'Nuevos Pacientes',
          data: pacientesData.map(d => d.cantidad),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    createOrUpdateChart('tortaChart', {
      type: 'pie',
      data: {
        labels: estadosData.map(d => d.label),
        datasets: [{
          data: estadosData.map(d => d.value),
          backgroundColor: estadosData.map(d => d.color),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    createOrUpdateChart('rankingChart', {
      type: 'bar',
      data: {
        labels: ['Dr. Juan Pérez', 'Dra. María López', 'Dr. Carlos Ruiz'],
        datasets: [{
          label: 'Pacientes Atendidos',
          data: [50, 45, 38],
          backgroundColor: this.palette.slice(0, 3),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  totalChartItems(items: { value: number }[]): number {
    return items.reduce((acc, i) => acc + i.value, 0);
  }


  // Modal methods
  openAllDoctorsModal(): void {
    // Asegurar que no haya modales de doctor abiertos
    this.showDoctorProfileModal = false;
    this.showDoctorAgendaModal = false;
    this.selectedDoctorForProfile = null;
    this.selectedDoctorForAgenda = null;
    this.doctorCitations = [];
    this.loadingCitations = false;

    this.showAllDoctorsModal = true;
  }

  closeAllDoctorsModal(): void {
    this.showAllDoctorsModal = false;
  }

  openDoctorProfileModal(doctor: any): void {
    // Buscar el doctor completo con emailDoctor desde allDoctors$
    this.allDoctors$.subscribe(doctors => {
      const fullDoctor = doctors.find(d => d.id === doctor.id);
      // Combinar información del doctor completo con propiedades visuales
      this.selectedDoctorForProfile = {
        ...fullDoctor,
        ...doctor, // Esto incluye color, status, etc. del StaffMember
        fullName: fullDoctor?.fullName || doctor.fullName,
        specialty: fullDoctor?.specialtyName || doctor.specialty,
        emailDoctor: fullDoctor?.emailDoctor
      };
      this.showDoctorProfileModal = true;
    });
  }

  closeDoctorProfileModal(): void {
    this.showDoctorProfileModal = false;
    this.selectedDoctorForProfile = null;
  }

  openDoctorAgendaModal(doctor: any): void {
    // Cerrar modal de perfil si está abierto para evitar sobreposiciones
    this.showDoctorProfileModal = false;
    this.selectedDoctorForProfile = null;

    // Limpiar estado anterior del modal de agenda
    this.doctorCitations = [];
    this.loadingCitations = true;

    // Buscar el doctor completo desde allDoctors$
    this.allDoctors$.subscribe(doctors => {
      const fullDoctor = doctors.find(d => d.id === doctor.id);
      // Combinar información del doctor completo con propiedades visuales
      this.selectedDoctorForAgenda = {
        ...fullDoctor,
        ...doctor, // Esto incluye color, status, etc. del StaffMember
        fullName: fullDoctor?.fullName || doctor.fullName,
        specialty: fullDoctor?.specialtyName || doctor.specialty,
        emailDoctor: fullDoctor?.emailDoctor
      };

      // Mostrar el modal de agenda
      this.showDoctorAgendaModal = true;

      // Cargar citas del doctor
      this.doctorService.getCitationsByDoctor(this.selectedDoctorForAgenda.id).subscribe({
        next: (citations) => {
          // Filtrar solo citas programadas/pendientes (no atendidas ni canceladas)
          this.doctorCitations = citations.filter(citation =>
            citation.state !== 'completed' && citation.state !== 'canceled'
          );
          this.loadingCitations = false;
        },
        error: (error) => {
          console.error('Error loading doctor citations:', error);
          this.doctorCitations = [];
          this.loadingCitations = false;
        }
      });
    });
  }

  closeDoctorAgendaModal(): void {
    this.showDoctorAgendaModal = false;
    this.selectedDoctorForAgenda = null;
    this.doctorCitations = [];
    this.loadingCitations = false;
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