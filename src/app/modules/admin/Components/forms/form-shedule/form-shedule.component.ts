import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TypeCitation } from '../../../../../shared/components/PagesShared/type-citation/type-citation.component';
import { TypeCitationService } from '../../../../../shared/services/Hospital/type-citation.service';
import { DoctorList } from '../../../../../shared/Models/hospital/DoctorListModel';
import { DoctorService } from '../../../../../shared/services/doctor.service';
import { ConsultingRoom } from '../../../../../shared/Models/hospital/shedule';
import { GenericService } from '../../../../../shared/services/base/generic.service';
import { MatStepper } from '@angular/material/stepper';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-form-shedule',
  standalone:false,
  templateUrl: './form-shedule.component.html',
  styleUrl: './form-shedule.component.css'
})
export class FormSheduleComponent {
 private _formBuilder = inject(FormBuilder);

 
// Agregar estas propiedades y métodos al componente

@ViewChild('stepper') stepper!: MatStepper;


// Propiedades adicionales
doctorList: DoctorList[] = [];
selectedDoctor: DoctorList | null = null;

  typeCitation: TypeCitation[] = [];
  selectedTypeCitation: TypeCitation | null = null;

  firstFormGroup = this._formBuilder.group({
    typeCitationId: ['', Validators.required],
  });

 secondFormGroup = this._formBuilder.group({
  doctorId: ['', Validators.required],
});

// Propiedades adicionales
consultingRoomList: ConsultingRoom[] = [];
selectedRoom: ConsultingRoom | null = null;

// Crear thirdFormGroup
thirdFormGroup = this._formBuilder.group({
  consultingRoomId: ['', Validators.required],
});

  isLinear = false;

constructor(
  private service: TypeCitationService,
  private doctorService: DoctorService,
  private genericservice :GenericService,
    private dialogRef: MatDialogRef<FormSheduleComponent> 
 // private consultingRoomService: ConsultingRoomService // Agregar este servicio
) { }


// Métodos para manejar doctores
loadDoctors(): void {
  this.doctorService.traerDoctorPersona2().subscribe({
    next: (data: DoctorList[]) => {
      // Filtrar solo doctores activos y no eliminados
      this.doctorList = data.filter(doctor => doctor.active && !doctor.isDeleted);
    },
    error: (error) => {
      console.error('Error loading doctors:', error);
    }
  });
}

selectDoctor(doctor: DoctorList): void {
  this.selectedDoctor = doctor;
  this.secondFormGroup.patchValue({
    doctorId: doctor.id.toString()
  });
}

isSelectedDoctor(doctor: DoctorList): boolean {
  return this.selectedDoctor?.id === doctor.id;
}

ngOnInit(): void {
  this.loadTypeCitations();
  this.loadDoctors();
  this.loadConsultingRooms();
}
  loadTypeCitations(): void {
    this.service.traerTodo().subscribe({
      next: (data: TypeCitation[]) => {
        this.typeCitation = data;
      },
      error: (error) => {
        console.error('Error loading type citations:', error);
      }
    });
  }

  selectTypeCitation(typeCitation: TypeCitation): void {
    this.selectedTypeCitation = typeCitation;
    this.firstFormGroup.patchValue({
      typeCitationId: typeCitation.id.toString()
    });
  }

  isSelected(typeCitation: TypeCitation): boolean {
    return this.selectedTypeCitation?.id === typeCitation.id;
  }

  
// Métodos para manejar consultorios
loadConsultingRooms(): void {
  this.doctorService.getConsultingRooms().subscribe({
    next: (data: ConsultingRoom[]) => {
      // Filtrar solo consultorios no eliminados
      this.consultingRoomList = data.filter(room => !room.isDeleted);
    },
    error: (error) => {
      console.error('Error loading consulting rooms:', error);
    }
  });
}


selectRoom(room: ConsultingRoom): void {
  this.selectedRoom = room;
  this.thirdFormGroup.patchValue({
    consultingRoomId: room.id.toString()
  });
}

isSelectedRoom(room: ConsultingRoom): boolean {
  return this.selectedRoom?.id === room.id;
}

// Agregar estas propiedades y métodos al componente

// Propiedades adicionales
quickNumbers = [1, 5, 10, 15, 20];

// Crear fourthFormGroup
fourthFormGroup = this._formBuilder.group({
  numberCitation: [0, [Validators.required, Validators.min(1), Validators.max(50)]],
});

// Método para selección rápida de números
selectQuickNumber(number: number): void {
  this.fourthFormGroup.patchValue({
    numberCitation: number
  });
}

// Método para obtener el color del botón de selección rápida
getQuickButtonColor(number: number): string {
  const currentValue = this.fourthFormGroup.get('numberCitation')?.value;
  return currentValue == number ? 'primary' : 'basic';
}

// Verificar si el formulario está completo
isFormComplete(): boolean {
  return this.firstFormGroup.valid && 
         this.secondFormGroup.valid && 
         this.thirdFormGroup.valid && 
         this.fourthFormGroup.valid;
}

// Método para enviar el formulario
// submitForm(): void {
//   if (this.isFormComplete()) {
//     const formData = {
//       typeCitationId: Number(this.firstFormGroup.get('typeCitationId')?.value) || 0,
//       doctorId: Number(this.secondFormGroup.get('doctorId')?.value) || 0,
//       consultingRoomId: Number(this.thirdFormGroup.get('consultingRoomId')?.value) || 0,
//       numberCitation: Number(this.fourthFormGroup.get('numberCitation')?.value) || 0
//     };

//     console.log('Datos del formulario:', formData);
//     this.genericservice.crearGeneric("Shedule" ,   formData).subscribe({
//    next: (response) => {
//     console.log('Citas creadas exitosamente:', response);

//   },
//   error: (error) => {
//     console.error('Error al crear las citas:', error);
    
//   }
// });

//   }
// }



// Agregar estas propiedades y métodos al componente

// Propiedades adicionales
minDate = new Date(); // Fecha mínima (hoy)
scheduleId: number = 0; // ID del schedule creado

// Crear fifthFormGroup
fifthFormGroup = this._formBuilder.group({
  startTime: ['', Validators.required],
  endTime: ['', Validators.required],
  breakStartTime: [''],
  breakEndTime: [''],
  hasBreak: [false],
programateDate: [new Date()]
}, {
  validators: [this.timeRangeValidator.bind(this)]
});

// Validador personalizado para rangos de tiempo
timeRangeValidator(form: any) {
  const startTime = form.get('startTime')?.value;
  const endTime = form.get('endTime')?.value;
  const breakStartTime = form.get('breakStartTime')?.value;
  const breakEndTime = form.get('breakEndTime')?.value;
  const hasBreak = form.get('hasBreak')?.value;

  const errors: any = {};

  // Validar rango de horario de trabajo
  if (startTime && endTime) {
    if (startTime >= endTime) {
      errors.timeRange = true;
    }
  }

  // Validar rango de descanso si está habilitado
  if (hasBreak) {
    if (!breakStartTime) {
      form.get('breakStartTime')?.setErrors({ required: true });
    }
    if (!breakEndTime) {
      form.get('breakEndTime')?.setErrors({ required: true });
    }
    
    if (breakStartTime && breakEndTime) {
      if (breakStartTime >= breakEndTime) {
        errors.breakTimeRange = true;
        form.get('breakEndTime')?.setErrors({ breakTimeRange: true });
      }
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

// Método para verificar si la configuración de horarios es válida
isScheduleConfigValid(): boolean {
  return this.fifthFormGroup.valid;
}

// Método para verificar si todos los formularios están completos
isAllFormsComplete(): boolean {
  return this.firstFormGroup.valid && 
         this.secondFormGroup.valid && 
         this.thirdFormGroup.valid && 
         this.fourthFormGroup.valid &&
         this.fifthFormGroup.valid;
}

// Método para formatear tiempo
formatTime(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

// Método para formatear fecha
formatDate(date: any): string {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Actualizar el método submitForm para capturar el scheduleId
submitForm(): void {
    if (this.isFormComplete()) {
      const formData = {
        typeCitationId: Number(this.firstFormGroup.get('typeCitationId')?.value) || 0,
        doctorId: Number(this.secondFormGroup.get('doctorId')?.value) || 0,
        consultingRoomId: Number(this.thirdFormGroup.get('consultingRoomId')?.value) || 0,
        numberCitation: Number(this.fourthFormGroup.get('numberCitation')?.value) || 0
      };

      this.genericservice.crearGeneric("Shedule", formData).subscribe({
        next: (response: any) => {
          // Guardar id
          this.scheduleId = response.id || response.sheduleId || 0;

          // Mostrar alerta
          Swal.fire({
            title: '¡Éxito!',
            text: 'Las citas fueron creadas, ahora configura los horarios.',
            icon: 'success',
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#4CAF50'
          }).then(() => {
            // Avanzar directamente al paso 5
            this.stepper.selectedIndex = 4; 
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron crear las citas. Intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#f44336'
          });
        }
      });
    }
  
}

// Método para enviar la configuración de horarios
submitScheduleConfiguration(): void {
  if (this.isAllFormsComplete() && this.scheduleId > 0) {
    const scheduleConfigData = {
      startTime: this.fifthFormGroup.get('startTime')?.value + ':00', // Agregar segundos
      endTime: this.fifthFormGroup.get('endTime')?.value + ':00',
      breakStartTime: this.fifthFormGroup.get('hasBreak')?.value ? 
        (this.fifthFormGroup.get('breakStartTime')?.value + ':00') : null,
      breakEndTime: this.fifthFormGroup.get('hasBreak')?.value ? 
        (this.fifthFormGroup.get('breakEndTime')?.value + ':00') : null,
      programateDate: this.formatDateForApi(this.fifthFormGroup.get('programateDate')?.value),
      sheduleId: this.scheduleId
    };

    console.log('Configuración de horarios:', scheduleConfigData);
    
    // Hacer la petición para crear los horarios
    this.genericservice.crearGeneric("ScheduleHour", scheduleConfigData).subscribe({
      next: (response: any) => {
        console.log('Configuración de horarios creada exitosamente:', response);
        
        // Mostrar SweetAlert de éxito
        this.showSuccessAlert();




        
        
        // Opcional: resetear formularios o redirigir
        this.resetAllForms();
      },
      error: (error) => {
        console.error('Error al crear la configuración de horarios:', error);
        this.showErrorAlert(error);
      }
    });
  } else {
    console.error('Formularios incompletos o scheduleId faltante');
    this.showErrorAlert('Datos incompletos');
  }
}

// Método para formatear fecha para la API
formatDateForApi(date: any): string {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

// Método para mostrar alerta de éxito
showSuccessAlert(): void {
  // Instalar SweetAlert2: npm install sweetalert2
  // import Swal from 'sweetalert2';
  
   
  Swal.fire({
    title: '¡Éxito!',
    text: 'Las citas y horarios han sido programados correctamente',
    icon: 'success',
    confirmButtonText: 'Continuar',
    confirmButtonColor: '#4CAF50',
    backdrop: true,
    allowOutsideClick: false,
    showClass: {
      popup: 'animate__animated animate__zoomIn'
    },
    hideClass: {
      popup: 'animate__animated animate__zoomOut'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Redirigir o realizar otra acción
       this.dialogRef.close();
      console.log('Usuario confirmó el éxito');
    }
  });
  
}

// Método para mostrar alerta de error
showErrorAlert(error: any): void {
  
  Swal.fire({
    title: 'Error',
    text: 'Ocurrió un error al procesar la solicitud. Por favor intenta nuevamente.',
    icon: 'error',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#f44336',
    backdrop: true,
    showClass: {
      popup: 'animate__animated animate__shakeX'
    }
  });
  
}

// Método para resetear todos los formularios
resetAllForms(): void {
  this.firstFormGroup.reset();
  this.secondFormGroup.reset();
  this.thirdFormGroup.reset();
  this.fourthFormGroup.reset();
  this.fifthFormGroup.reset();
  
  // Resetear variables
  this.selectedTypeCitation = null;
  this.selectedDoctor = null;
  this.selectedRoom = null;
  this.scheduleId = 0;
}

// Método para manejar cambios en el toggle de descanso
onBreakToggleChange(): void {
  const hasBreak = this.fifthFormGroup.get('hasBreak')?.value;
  
  if (!hasBreak) {
    // Limpiar campos de descanso si se deshabilita
    this.fifthFormGroup.patchValue({
      breakStartTime: '',
      breakEndTime: ''
    });
    
    // Remover validaciones de campos de descanso
    this.fifthFormGroup.get('breakStartTime')?.clearValidators();
    this.fifthFormGroup.get('breakEndTime')?.clearValidators();
  } else {
    // Agregar validaciones si se habilita
    this.fifthFormGroup.get('breakStartTime')?.setValidators([Validators.required]);
    this.fifthFormGroup.get('breakEndTime')?.setValidators([Validators.required]);
  }
  
  // Actualizar validaciones
  this.fifthFormGroup.get('breakStartTime')?.updateValueAndValidity();
  this.fifthFormGroup.get('breakEndTime')?.updateValueAndValidity();
}



}
