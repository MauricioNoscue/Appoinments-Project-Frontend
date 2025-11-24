import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormEditPermissionComponent } from './form-edit-permission.component';

describe('FormEditPermissionComponent', () => {
  let component: FormEditPermissionComponent;
  let fixture: ComponentFixture<FormEditPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormEditPermissionComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA]
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
