import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { InstitutionsComponent } from './institutions.component';
import { InstitutionService } from '../../../../shared/services/institution.service';

describe('InstitutionsComponent', () => {
  let component: InstitutionsComponent;
  let fixture: ComponentFixture<InstitutionsComponent>;

  beforeEach(async () => {
    const institutionServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
      eliminar: jasmine.createSpy('eliminar').and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [InstitutionsComponent], // ✅ Correcto
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: InstitutionService, useValue: institutionServiceMock },
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(null) }) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
