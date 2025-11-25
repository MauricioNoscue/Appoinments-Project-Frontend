import { TestBed } from '@angular/core/testing';

import { DoctorReviewService } from './doctor-review.service';

describe('DoctorReviewService', () => {
  let service: DoctorReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
