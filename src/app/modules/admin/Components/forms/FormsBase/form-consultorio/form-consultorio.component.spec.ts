import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConsultorioComponent } from './form-consultorio.component';

describe('FormConsultorioComponent', () => {
  let component: FormConsultorioComponent;
  let fixture: ComponentFixture<FormConsultorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConsultorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormConsultorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
