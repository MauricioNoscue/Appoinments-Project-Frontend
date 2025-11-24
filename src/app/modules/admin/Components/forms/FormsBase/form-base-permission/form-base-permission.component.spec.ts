import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBasePermissionComponent } from './form-base-permission.component';

describe('FormBasePermissionComponent', () => {
  let component: FormBasePermissionComponent;
  let fixture: ComponentFixture<FormBasePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormBasePermissionComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA]
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
