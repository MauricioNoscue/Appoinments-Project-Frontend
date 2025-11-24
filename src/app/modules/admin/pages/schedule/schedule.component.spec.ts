import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ScheduleComponent } from './schedule.component';
import { GenericService } from './../../../../shared/services/base/generic.service';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;
  let genericServiceMock: any;

  beforeEach(async () => {
    // 1. Mock del servicio genérico
    genericServiceMock = {
      getgeneric: jasmine.createSpy('getgeneric').and.returnValue(of([])), // Simula respuesta vacía
      delete: jasmine.createSpy('delete').and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      declarations: [ScheduleComponent], // Correcto, es standalone: false
      imports: [],
      providers: [
        // 2. Inyectar dependencias
        { provide: GenericService, useValue: genericServiceMock },
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(null) }) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
