import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CalendarComponent } from './calendar.component';
import { CoreCitationService } from '../../../../shared/services/Hospital/core-citation.service';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    // Mock del servicio
    const coreCitationServiceMock = {
      // Agrega aquí métodos si el componente los llama en ngOnInit
      // Por ejemplo: getDates: jasmine.createSpy('getDates').and.returnValue(of([]))
      getAvailableBlocks: jasmine.createSpy('getAvailableBlocks').and.returnValue(of([])),
    };

    await TestBed.configureTestingModule({
      declarations: [CalendarComponent], // Correcto
      imports: [],
      providers: [
        // ✅ Inyectamos el mock
        { provide: CoreCitationService, useValue: coreCitationServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
