import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; // 1. Para el FormBuilder
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogRef } from '@angular/material/dialog'; // 2. Para el diálogo

import { FormSheduleComponent } from './form-shedule.component';

describe('FormSheduleComponent', () => {
  let component: FormSheduleComponent;
  let fixture: ComponentFixture<FormSheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ✅ CORRECCIÓN: Es 'standalone: false', así que se declara
      declarations: [FormSheduleComponent],

      // ✅ Importamos módulos necesarios
      imports: [ReactiveFormsModule],

      // ✅ Proveemos dependencias falsas
      providers: [
        provideHttpClient(), // Soluciona error de servicios HTTP
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: {} }, // Soluciona error de MatDialog
      ],

      // ✅ Ignoramos componentes hijos (como app-type-citation o mat-stepper)
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
