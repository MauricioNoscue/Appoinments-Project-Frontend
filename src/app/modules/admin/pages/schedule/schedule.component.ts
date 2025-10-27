import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { shedule } from '../../../../shared/Models/hospital/shedule';
import { GenericService } from './../../../../shared/services/base/generic.service';
import { FormSheduleComponent } from '../../Components/forms/form-shedule/form-shedule.component';
import { DialogContainerComponent } from '../../../../shared/components/Modal/dialog-container/dialog-container.component';
import { ComponentType } from '@angular/cdk/overlay';

import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';

export interface DynamicDialogData<TPayload = unknown> {
  component: ComponentType<any>; 
  payload?: TPayload;            

}@Component({
  selector: 'app-schedule',
  standalone: false,
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {
  shedules: shedule[] = [];
  shedulesFiltered: shedule[] = [];

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
      this.shedulesFiltered = [...this.shedules]; 
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
            this.loadShedules(); 
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


pageIndex = 0;
pageSize = 12;

onPageChange(event: PageEvent): void {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
        this.loadShedules();
}

  openFormShedule(): void {
    const data: DynamicDialogData = {
      component: FormSheduleComponent,
      payload: {} 
    };

    const ref = this.dialog.open(DialogContainerComponent, {
      width: '1000px',
      data
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.loadShedules();
      }
    });
  }
}
