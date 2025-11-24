import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common'; // 1. Importar DatePipe (está en providers del componente)
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CitationDetailsDialogComponent } from './citation-details-dialog.component';

describe('CitationDetailsDialogComponent', () => {
  let component: CitationDetailsDialogComponent;
  let fixture: ComponentFixture<CitationDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CitationDetailsDialogComponent], // standalone: false
      imports: [],
      providers: [
        DatePipe, // Necesario porque el componente lo inyecta
        { provide: MatDialogRef, useValue: { close: () => {} } },

        // 2. AQUÍ ESTÁ LA CORRECCIÓN:
        // En lugar de {}, pasamos un objeto con la estructura { citation: { ... } }
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            citation: {
              state: 'pendiente', // Dato obligatorio para que no falle stateClass()
              patientName: 'Paciente Prueba',
              appointmentDate: '2023-01-01',
              timeBlock: '10:00',
              consultingRoomName: 'Consultorio 1',
              roomNumber: '101'
              // ... puedes agregar más campos si el HTML los pide obligatoriamente
            }
          }
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
