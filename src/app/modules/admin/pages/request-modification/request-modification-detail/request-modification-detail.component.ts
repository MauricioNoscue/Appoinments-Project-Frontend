import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModificationRequestListDto } from '../../../../../shared/Models/Request/ModificationRequest';
import { RequestServiceService } from '../../../../../shared/services/Request/request-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-modification-detail',
  standalone:false,
  templateUrl: './request-modification-detail.component.html',
  styleUrl: './request-modification-detail.component.css'
})
export class RequestModificationDetailComponent  implements OnInit {

  
  request?: ModificationRequestListDto;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { id: number },
    private dialogRef: MatDialogRef<RequestModificationDetailComponent>,
    private service: RequestServiceService
  ) {}

  ngOnInit(): void {
    this.cargarDetalle();
    console.log(this.request)
  }

  cargarDetalle(): void {
    this.service.obtenerPorId(this.data.id).subscribe({
      next: (res) => this.request = res,
      error: () => this.dialogRef.close(),
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

aprobar(): void {
  if (!this.request) return;

  Swal.fire({
    title: '¿Aprobar solicitud?',
    text: 'Esta acción actualizará el estado a Aprobado.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, aprobar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {

      this.service.updateStatus('ModificationRequest',  this.request!.id, 8)

        .subscribe({
          next: () => {
            Swal.fire({
              title: 'Aprobada',
              text: 'La solicitud ha sido aprobada correctamente.',
              icon: 'success'
            }).then(() => this.dialogRef.close(true));
          },
          error: () => {
            Swal.fire('Error', 'No se pudo aprobar la solicitud.', 'error');
          }
        });

    }
  });
}

rechazar(): void {
  if (!this.request) return;

  Swal.fire({
    title: '¿Rechazar solicitud?',
    text: 'Esta acción actualizará el estado a Rechazado.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, rechazar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {

      this.service.updateStatus('ModificationRequest',  this.request!.id, 9)
        .subscribe({
          next: () => {
            Swal.fire({
              title: 'Rechazada',
              text: 'La solicitud ha sido rechazada correctamente.',
              icon: 'success'
            }).then(() => this.dialogRef.close(true));
          },
          error: () => {
            Swal.fire('Error', 'No se pudo rechazar la solicitud.', 'error');
          }
        });

    }
  });
}


}
