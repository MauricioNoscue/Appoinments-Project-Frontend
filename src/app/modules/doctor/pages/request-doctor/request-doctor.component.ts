import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ModificationRequestListDto } from '../../../../shared/Models/Request/ModificationRequest';
import { ColumnDefinition } from '../../../../shared/Models/Tables/TableModels';
import { RequestServiceService } from '../../../../shared/services/Request/request-service.service';
import { RequestModificationDetailComponent } from '../../../admin/pages/request-modification/request-modification-detail/request-modification-detail.component';
import { RequestDoctorDetailsComponent } from './request-doctor-details/request-doctor-details.component';
import { RequestDoctorCreateComponent } from './request-doctor-create/request-doctor-create.component';
import { AuthService } from '../../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-request-doctor',
  standalone: false,
  templateUrl: './request-doctor.component.html',
  styleUrl: './request-doctor.component.css'
})
export class RequestDoctorComponent {

constructor(
    private service: RequestServiceService,
    private dialog: MatDialog,private authService: AuthService
  ) {}

  dataSource: ModificationRequestListDto[] = [];
  dataSourceFiltered: ModificationRequestListDto[] = [];

  // 🔹 Columnas reutilizables
columnDefs: ColumnDefinition[] = [
  { key: 'index', label: '#'}, // <-- sin type

  {
    key: 'userName',
    label: 'Usuario'
  },

  {
    key: 'document',
    label: 'Documento'
  },

  {
    key: 'typeRequest',
    label: 'Tipo',
    type: 'chip',
    colorFn: () => 'primary',
    format: (x) => this.formatTypeRequest(x.typeRequest),
  },

 {
  key: 'statusTypeName',
  label: 'Estado',
  type: 'chip',
  cssClassFn: (row) => {
  const raw = row?.statusTypeName;
  if (!raw) return ''; // ← Protección total

  const s = raw.toLowerCase();

  if (s.includes('ingreso')) return 'state-ingreso';
  if (s.includes('salida')) return 'state-salida';
  if (s.includes('aprob')) return 'state-aprobado';
  if (s.includes('rech')) return 'state-rechazado';
  if (s.includes('cance')) return 'state-rechazado';
  if (s.includes('pend')) return 'state-pendiente';

  return '';
}

},
  {
    key: 'actions',
    label: 'Acciones',
    type: 'actions',
    hideEdit: true 
  },
];

crearSolicitud(): void {
  const dialogRef = this.dialog.open(RequestDoctorCreateComponent, {
    width: '600px',
   data: { userId: this.authService.getUserId() }
 // ← reemplaza con el user real del doctor
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return;

    this.service.crear(result).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Solicitud creada correctamente', 'success');
        this.cargarSolicitudes();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo crear la solicitud', 'error');
      }
    });
  });
}

  displayedColumns: string[] = this.columnDefs.map((c) => c.key);

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  /** 🔄 Cargar solicitudes */
  cargarSolicitudes(): void {
    this.service.GetAllUser().subscribe({
      next: (data) => {
        console.log(data);  
        this.dataSource = data;
        this.dataSourceFiltered = [...this.dataSource];
      },
      error: (err) => {
        console.error('Error al cargar las solicitudes:', err);
        Swal.fire('Error', 'No se pudieron cargar las solicitudes.', 'error');
      },
    });
  }

  /** 🏷️ Formatear enumeración de TypeRequest */
  private formatTypeRequest(t: number): string {
    switch (t) {
      case 0: return 'Desbloqueo';
      case 1: return 'Falta';
      case 2: return 'Otro';
      default: return 'N/A';
    }
  }

  /** 🎯 Acciones emitidas desde la tabla genérica */
    handleAction(e: { action: string; element: ModificationRequestListDto }) {
    const { action, element } = e;

    if (action === 'detail') {
      this.verDetalle(element);
      return;
    }

    if (action === 'approve') {
      this.aprobarSolicitud(element);
      return;
    }

    if (action === 'reject') {
      this.rechazarSolicitud(element);
      return;
    }

    if (action === 'delete') {
      this.eliminarSolicitud(element.id);
      return;
    }
  }

  // ------------------------------------------------------------
  // 🚨 Métodos solicitados (solo la estructura, tú los implementas)
  // ------------------------------------------------------------

verDetalle(item: ModificationRequestListDto): void {
  const dialogRef = this.dialog.open(RequestDoctorDetailsComponent, {
    width: '650px',
    data: { id: item.id }
  });

  // 🔄 Si aprobaron/rechazaron → refrescar lista
  dialogRef.afterClosed().subscribe(result => {
    if (result) this.cargarSolicitudes();
  });
}



  /** ✔️ Aprobar solicitud */
  aprobarSolicitud(item: ModificationRequestListDto): void {
    // 👉 Llama a tu servicio: this.service.approve(item.id)
  }

  /** ❌ Rechazar solicitud */
  rechazarSolicitud(item: ModificationRequestListDto): void {
    // 👉 Llama a tu servicio: this.service.reject(item.id)
  }

  /** 🗑️ Eliminar */
  eliminarSolicitud(id: number): void {
    // 👉 SweetAlert + this.service.delete(id)
  }

}
