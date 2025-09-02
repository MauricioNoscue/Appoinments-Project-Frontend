import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TypeCitation } from '../../../../../shared/components/PagesShared/type-citation/type-citation.component';
import { TypeCitationService } from '../../../../../shared/services/Hospital/type-citation.service';
import { DoctorList } from '../../../../../shared/Models/hospital/DoctorListModel';
import { DoctorService } from '../../../../../shared/services/doctor.service';
import { ConsultingRoom } from '../../../../../shared/Models/hospital/shedule';
import { GenericService } from '../../../../../shared/services/base/generic.service';

@Component({
  selector: 'app-form-shedule',
  standalone:false,
  templateUrl: './form-shedule.component.html',
  styleUrl: './form-shedule.component.css'
})
export class FormSheduleComponent {
 private _formBuilder = inject(FormBuilder);

 
// Agregar estas propiedades y métodos al componente

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
  private genericservice :GenericService
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
submitForm(): void {
  if (this.isFormComplete()) {
    const formData = {
      typeCitationId: Number(this.firstFormGroup.get('typeCitationId')?.value) || 0,
      doctorId: Number(this.secondFormGroup.get('doctorId')?.value) || 0,
      consultingRoomId: Number(this.thirdFormGroup.get('consultingRoomId')?.value) || 0,
      numberCitation: Number(this.fourthFormGroup.get('numberCitation')?.value) || 0
    };

    console.log('Datos del formulario:', formData);
    this.genericservice.crearGeneric("Shedule" ,   formData).subscribe({
   next: (response) => {
    console.log('Citas creadas exitosamente:', response);
    // Mostrar mensaje de éxito
    // Resetear formulario si es necesario
  },
  error: (error) => {
    console.error('Error al crear las citas:', error);
    // Mostrar mensaje de error
  }
});

  }
}

}
