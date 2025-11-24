import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { DepartamentComponent } from './departament.component';
import { DepartamentService } from '../../../../shared/services/departament.service';

describe('DepartamentComponent', () => {
  let component: DepartamentComponent;
  let fixture: ComponentFixture<DepartamentComponent>;

  beforeEach(async () => {
    const departamentServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
      eliminar: jasmine.createSpy('eliminar').and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      // ✅ CORRECCIÓN: Es standalone, va en imports
      imports: [DepartamentComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DepartamentService, useValue: departamentServiceMock },
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(null) }) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
