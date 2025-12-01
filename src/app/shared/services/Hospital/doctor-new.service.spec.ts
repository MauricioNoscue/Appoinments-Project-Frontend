import { TestBed } from '@angular/core/testing';

import { DoctorNewService } from './doctor-new.service';

describe('DoctorNewService', () => {
  let service: DoctorNewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorNewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
