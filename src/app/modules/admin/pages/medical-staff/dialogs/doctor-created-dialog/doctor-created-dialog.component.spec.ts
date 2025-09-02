import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCreatedDialogComponent } from './doctor-created-dialog.component';

describe('DoctorCreatedDialogComponent', () => {
  let component: DoctorCreatedDialogComponent;
  let fixture: ComponentFixture<DoctorCreatedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorCreatedDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorCreatedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
