import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { shedule } from '../../../../shared/Models/hospital/shedule';
import { GenericService } from './../../../../shared/services/base/generic.service';
import { FormSheduleComponent } from '../../Components/forms/form-shedule/form-shedule.component';
import { DialogContainerComponent } from '../../../../shared/components/Modal/dialog-container/dialog-container.component';
import { ComponentType } from '@angular/cdk/overlay';

import Swal from 'sweetalert2';

export interface DynamicDialogData<TPayload = unknown> {
  component: ComponentType<any>; // componente que quieres mostrar
  payload?: TPayload;            // datos iniciales que le pasas
}

@Component({
  selector: 'app-schedule',
  standalone: false,
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {
  shedules: shedule[] = [];

  constructor(
    private service: GenericService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadShedules();
  }

  private loadShedules(): void {
    this.service.getgeneric('Shedule').subscribe(data => {
      this.shedules = data;
    });
  }

Delete(id: number) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    backdrop: true,
  }).then((result) => {
    if (result.isConfirmed) {
      // 👇 Solo eliminamos si confirma
      this.service.Delete("Shedule", id).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Horario eliminado con éxito',
            icon: 'success',
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#4CAF50',
            backdrop: true,
            allowOutsideClick: false,
            showClass: { popup: 'animate__animated animate__zoomIn' },
            hideClass: { popup: 'animate__animated animate__zoomOut' }
          }).then(() => {
            this.loadShedules(); // 👈 recargar después del éxito
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el horario. Intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#f44336'
          });
          console.error('Error al eliminar:', error);
        }
      });
    }
  });
}


  // 👉 abrir modal para agregar horario
  openFormShedule(): void {
    const data: DynamicDialogData = {
      component: FormSheduleComponent,
      payload: {} // si quieres pasar datos iniciales al formulario
    };

    const ref = this.dialog.open(DialogContainerComponent, {
      width: '1000px',
      data
    });

    // Al cerrarse el diálogo
    ref.afterClosed().subscribe(result => {
      if (result) {
        // comentario: aquí recibes los datos que emitió/cerró FormSheduleComponent
        console.log('Nuevo horario:', result);

        // recargar lista si se agregó uno nuevo
        this.loadShedules();
      }
    });
  }
}
