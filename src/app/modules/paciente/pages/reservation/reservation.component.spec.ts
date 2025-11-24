import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ReservationComponent } from './reservation.component';
import { TypeCitationService } from '../../../../shared/services/Hospital/type-citation.service';

describe('ReservationComponent', () => {
  let component: ReservationComponent;
  let fixture: ComponentFixture<ReservationComponent>;

  beforeEach(async () => {
    // Mock del servicio
    const typeCitationServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };

    await TestBed.configureTestingModule({
      // ✅ CORRECCIÓN: Es standalone: false, va en declarations
      declarations: [ReservationComponent],
      imports: [],
      providers: [
        { provide: TypeCitationService, useValue: typeCitationServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
