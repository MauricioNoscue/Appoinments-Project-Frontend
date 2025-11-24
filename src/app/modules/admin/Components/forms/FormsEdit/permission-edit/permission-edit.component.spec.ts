import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { PermissionEditComponent } from './permission-edit.component';

describe('PermissionEditComponent', () => {
  let component: PermissionEditComponent;
  let fixture: ComponentFixture<PermissionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermissionEditComponent], // Correcto (standalone: false)
      imports: [],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        // IMPORTANTE: Proveer el token 'MODAL_DATA'
        {
          provide: 'MODAL_DATA',
          useValue: { id: 1, name: 'Test', description: 'Desc' },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
