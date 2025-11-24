import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common'; // Importar DatePipe

import { CitationDetailsDialogComponent } from '../../../doctor/pages/history-citations/citation-details-dialog/citation-details-dialog.component';

describe('CitationDetailsDialogComponent', () => {
  let component: CitationDetailsDialogComponent;
  let fixture: ComponentFixture<CitationDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CitationDetailsDialogComponent],
      imports: [],
      providers: [
        DatePipe, // El componente usa DatePipe en el constructor
        { provide: MatDialogRef, useValue: { close: () => {} } },

        // ✅ CORRECCIÓN: Aquí está el cambio clave.
        // En lugar de useValue: {}, le damos la estructura que pide el HTML.
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            citation: {
              state: 'pendiente',
              patientName: 'Paciente de Prueba',
              appointmentDate: '2023-10-20',
              timeBlock: '08:00',
              consultingRoomName: 'Consultorio 1',
              roomNumber: '101',
              nameDoctor: 'Dr. House',
              registrationDate: '2023-10-10',
              note: 'Sin novedades',
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
