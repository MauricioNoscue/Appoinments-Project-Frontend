import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditPermissionComponent } from './form-edit-permission.component';

describe('FormEditPermissionComponent', () => {
  let component: FormEditPermissionComponent;
  let fixture: ComponentFixture<FormEditPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEditPermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEditPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
