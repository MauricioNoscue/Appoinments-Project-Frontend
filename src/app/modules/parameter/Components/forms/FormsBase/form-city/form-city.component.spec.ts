import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCityComponent } from './form-city.component';

describe('FormCityComponent', () => {
  let component: FormCityComponent;
  let fixture: ComponentFixture<FormCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
