import { TestBed } from '@angular/core/testing';

import { TypeCitationsService } from './type-citations.service';

describe('TypeCitationsService', () => {
  let service: TypeCitationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeCitationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
