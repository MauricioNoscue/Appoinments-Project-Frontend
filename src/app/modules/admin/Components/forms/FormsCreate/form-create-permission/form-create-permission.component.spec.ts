import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormCreatePermissionComponent } from './form-create-permission.component';

describe('FormCreatePermissionComponent', () => {
  let component: FormCreatePermissionComponent;
  let fixture: ComponentFixture<FormCreatePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormCreatePermissionComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCreatePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
