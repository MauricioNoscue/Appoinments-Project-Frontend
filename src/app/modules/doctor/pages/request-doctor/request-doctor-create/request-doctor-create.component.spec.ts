import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDoctorCreateComponent } from './request-doctor-create.component';

describe('RequestDoctorCreateComponent', () => {
  let component: RequestDoctorCreateComponent;
  let fixture: ComponentFixture<RequestDoctorCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestDoctorCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDoctorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
