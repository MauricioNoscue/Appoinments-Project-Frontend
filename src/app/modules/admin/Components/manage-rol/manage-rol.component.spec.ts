import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRolComponent } from './manage-rol.component';

describe('ManageRolComponent', () => {
  let component: ManageRolComponent;
  let fixture: ComponentFixture<ManageRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
