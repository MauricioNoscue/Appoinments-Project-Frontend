import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBasePermissionComponent } from './form-base-permission.component';

describe('FormBasePermissionComponent', () => {
  let component: FormBasePermissionComponent;
  let fixture: ComponentFixture<FormBasePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBasePermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormBasePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
