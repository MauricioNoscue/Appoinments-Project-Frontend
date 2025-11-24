import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Import tokens

import { DoctorCreatedDialogComponent } from '../../../../modules/admin/pages/medical-staff/dialogs/doctor-created-dialog/doctor-created-dialog.component';

describe('DoctorCreatedDialogComponent', () => {
  let component: DoctorCreatedDialogComponent;
  let fixture: ComponentFixture<DoctorCreatedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ✅ Component goes in declarations because it is standalone: false
      declarations: [DoctorCreatedDialogComponent],
      imports: [],
      providers: [
        // ✅ Mock required to close the dialog
        { provide: MatDialogRef, useValue: { close: () => {} } },

        // ✅ CORRECTION: Provide the complete data structure expected by the HTML
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            doctor: {
              image: 'assets/images/default-doctor.png', // Prevents error reading .image
              fullName: 'Dr. Test', // Data to display
              specialtyName: 'General Medicine',
              emailDoctor: 'test@hospital.com',
              phoneNumber: '1234567890',
              birthDate: '1990-01-01',
              identification: '123456',
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
