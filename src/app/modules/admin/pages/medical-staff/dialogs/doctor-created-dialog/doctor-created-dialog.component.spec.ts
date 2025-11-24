import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DoctorCreatedDialogComponent } from './doctor-created-dialog.component';

describe('DoctorCreatedDialogComponent', () => {
  let component: DoctorCreatedDialogComponent;
  let fixture: ComponentFixture<DoctorCreatedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorCreatedDialogComponent], // Correcto, no es standalone
      imports: [],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },

        // ✅ CORRECCIÓN AQUÍ:
        // En lugar de {}, entregamos la estructura { doctor: { image: '...', ... } }
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            doctor: {
              image: 'assets/images/doc.jpeg', // Valor falso para que no falle
              fullName: 'Dr. Test', // Valor falso para mostrar nombre
              specialtyName: 'Cardiología', // Valor falso para especialidad
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorCreatedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
