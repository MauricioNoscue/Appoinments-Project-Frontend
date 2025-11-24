import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { RolComponent } from './rol.component';
import { RolService } from '../../../../../shared/services/rol.service';

describe('RolComponent', () => {
  let component: RolComponent;
  let fixture: ComponentFixture<RolComponent>;
  let rolServiceMock: any;

  beforeEach(async () => {
    // 1. Crear Mock del servicio
    rolServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
      eliminar: jasmine.createSpy('eliminar').and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      declarations: [RolComponent], // Correcto (standalone: false)
      imports: [],
      providers: [
        // 2. Inyectar mocks
        { provide: RolService, useValue: rolServiceMock },
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(null) }) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
