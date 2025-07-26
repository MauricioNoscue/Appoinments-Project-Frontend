import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreatePermissionComponent } from './form-create-permission.component';

describe('FormCreatePermissionComponent', () => {
  let component: FormCreatePermissionComponent;
  let fixture: ComponentFixture<FormCreatePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreatePermissionComponent]
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
