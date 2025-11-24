import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { TypeCitationManagementComponent } from './type-citation-management.component';
import { TypeCitationService } from '../../../../shared/services/Hospital/type-citation.service';

describe('TypeCitationManagementComponent', () => {
  let component: TypeCitationManagementComponent;
  let fixture: ComponentFixture<TypeCitationManagementComponent>;

  beforeEach(async () => {
    // Mock simple del servicio
    const typeCitationServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])), // Retorna lista vacía
    };

    await TestBed.configureTestingModule({
      declarations: [TypeCitationManagementComponent], // Correcto
      imports: [],
      providers: [
        { provide: TypeCitationService, useValue: typeCitationServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TypeCitationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
