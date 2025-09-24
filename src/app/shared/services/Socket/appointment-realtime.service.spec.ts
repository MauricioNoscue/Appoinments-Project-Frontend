import { TestBed } from '@angular/core/testing';

import { AppointmentRealtimeService } from './appointment-realtime.service';

describe('AppointmentRealtimeService', () => {
  let service: AppointmentRealtimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentRealtimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
