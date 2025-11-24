import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ManageRolComponent } from './manage-rol.component';

describe('ManageRolComponent', () => {
  let component: ManageRolComponent;
  let fixture: ComponentFixture<ManageRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageRolComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA]
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
