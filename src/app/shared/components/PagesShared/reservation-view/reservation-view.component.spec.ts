import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router'; // Para ActivatedRoute
import { of } from 'rxjs';

import { ReservationViewComponent } from './reservation-view.component';
import { CoreCitationService } from '../../../../shared/services/Hospital/core-citation.service';
import { SocketService } from '../../../../shared/services/Socket/socket.service';

describe('ReservationViewComponent', () => {
  let component: ReservationViewComponent;
  let fixture: ComponentFixture<ReservationViewComponent>;

  beforeEach(async () => {
    // Mocks
    const coreCitationMock = {
      getCitationAvailable: jasmine
        .createSpy('getCitationAvailable')
        .and.returnValue(of([])),
    };
    const socketMock = {
      on: jasmine.createSpy('on').and.returnValue(of({})),
      connect: jasmine.createSpy('connect'),
      disconnect: jasmine.createSpy('disconnect'),
      leaveDay: jasmine.createSpy('leaveDay'),
    };

    await TestBed.configureTestingModule({
      declarations: [ReservationViewComponent], // Correcto
      imports: [],
      providers: [
        provideRouter([]),
        { provide: CoreCitationService, useValue: coreCitationMock },
        { provide: SocketService, useValue: socketMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
