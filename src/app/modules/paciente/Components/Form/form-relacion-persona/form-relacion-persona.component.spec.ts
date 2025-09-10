import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRelacionPersonaComponent } from './form-relacion-persona.component';

describe('FormRelacionPersonaComponent', () => {
  let component: FormRelacionPersonaComponent;
  let fixture: ComponentFixture<FormRelacionPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRelacionPersonaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRelacionPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
