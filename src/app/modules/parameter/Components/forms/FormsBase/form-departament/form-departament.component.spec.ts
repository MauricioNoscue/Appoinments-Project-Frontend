import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDepartamentComponent } from './form-departament.component';

describe('FormDepartamentComponent', () => {
  let component: FormDepartamentComponent;
  let fixture: ComponentFixture<FormDepartamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDepartamentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDepartamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
