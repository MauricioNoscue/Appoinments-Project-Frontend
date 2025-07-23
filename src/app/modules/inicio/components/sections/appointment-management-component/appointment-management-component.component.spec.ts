import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentManagementComponentComponent } from './appointment-management-component.component';

describe('AppointmentManagementComponentComponent', () => {
  let component: AppointmentManagementComponentComponent;
  let fixture: ComponentFixture<AppointmentManagementComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentManagementComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentManagementComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
