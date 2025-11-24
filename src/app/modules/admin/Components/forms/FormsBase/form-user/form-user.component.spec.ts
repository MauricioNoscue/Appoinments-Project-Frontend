import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; // 1. Importar módulo de formularios
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Por si acaso lo usa internamente

import { FormUserComponent } from './form-user.component';

describe('FormUserComponent', () => {
  let component: FormUserComponent;
  let fixture: ComponentFixture<FormUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ✅ CORRECTO: Es standalone: false, va en declarations
      declarations: [FormUserComponent],

      // ✅ AGREGAR: Necesario para que funcionen los formularios
      imports: [ReactiveFormsModule],

      providers: [
        // ✅ AGREGAR: Soluciona el error de "No provider for HttpClient"
        provideHttpClient(),
        provideHttpClientTesting(),
        // Mocks opcionales si el componente es un modal o usa uno
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
