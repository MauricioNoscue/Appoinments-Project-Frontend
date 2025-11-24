import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { FormComponent } from './form.component';
import { FormService } from '../../../../../shared/services/form.service';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent], // ✅ CORRECCIÓN: Va aquí porque es standalone: false
      imports: [],
      providers: [
        provideHttpClient(), // ✅ Soluciona error de HTTP
        provideHttpClientTesting(),
        // ✅ Mock para el servicio
        {
          provide: FormService,
          useValue: {
            traerTodo: () => of([]), // Simula respuesta vacía
            eliminar: () => of({}),
            crear: () => of({}),
            actualizar: () => of({}),
          },
        },
        // ✅ Mock para el diálogo
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(null) }) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
