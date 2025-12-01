import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDoctorDetailsComponent } from './request-doctor-details.component';

describe('RequestDoctorDetailsComponent', () => {
  let component: RequestDoctorDetailsComponent;
  let fixture: ComponentFixture<RequestDoctorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestDoctorDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDoctorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
