import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router'; // Para ActivatedRoute
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormConsultorioComponent } from './form-consultorio.component';

describe('FormConsultorioComponent', () => {
  let component: FormConsultorioComponent;
  let fixture: ComponentFixture<FormConsultorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ✅ CORRECCIÓN 1: Es standalone, va en imports
      imports: [FormConsultorioComponent],
      declarations: [],
      providers: [
        // ✅ CORRECCIÓN 2: Agregamos dependencias necesarias
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormConsultorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
