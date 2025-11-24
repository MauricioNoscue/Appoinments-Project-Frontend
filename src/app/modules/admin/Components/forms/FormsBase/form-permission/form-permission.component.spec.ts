import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Importar tokens

import { FormPermissionComponent } from './form-permission.component';

describe('FormPermissionComponent', () => {
  let component: FormPermissionComponent;
  let fixture: ComponentFixture<FormPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPermissionComponent], // ✅ CORRECTO (Es standalone)
      providers: [
        // ✅ AGREGAR: Simulación del diálogo
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
