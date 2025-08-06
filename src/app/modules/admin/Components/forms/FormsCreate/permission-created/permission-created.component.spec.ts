import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionCreatedComponent } from './permission-created.component';

describe('PermissionCreatedComponent', () => {
  let component: PermissionCreatedComponent;
  let fixture: ComponentFixture<PermissionCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionCreatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
