import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSheduleComponent } from './form-shedule.component';

describe('FormSheduleComponent', () => {
  let component: FormSheduleComponent;
  let fixture: ComponentFixture<FormSheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
