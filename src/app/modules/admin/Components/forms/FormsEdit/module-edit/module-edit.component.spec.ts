import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ModuleEditComponent } from './module-edit.component';
import { ModuleService } from '../../../../../../shared/services/module.service';

describe('ModuleEditComponent', () => {
  let component: ModuleEditComponent;
  let fixture: ComponentFixture<ModuleEditComponent>;

  beforeEach(async () => {
    // 1. Mock del servicio para evitar llamadas HTTP reales
    const moduleServiceMock = {
      actualizar: jasmine.createSpy('actualizar').and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      // ✅ Correcto: Es standalone: false, así que se declara
      declarations: [ModuleEditComponent],
      imports: [],
      providers: [
        // ✅ Inyectamos el servicio falso
        { provide: ModuleService, useValue: moduleServiceMock },

        // ✅ Mock para poder cerrar la ventana modal
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: 'MODAL_DATA',
          useValue: {
            id: 1,
            name: 'Test Module',
            description: 'Test Description',
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
