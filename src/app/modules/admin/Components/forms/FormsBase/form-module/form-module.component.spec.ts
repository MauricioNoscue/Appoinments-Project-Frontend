import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormModuleComponent } from './form-module.component';

describe('FormModuleComponent', () => {
  let component: FormModuleComponent;
  let fixture: ComponentFixture<FormModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ✅ CORRECCIÓN 1: Es standalone, va en imports
      imports: [FormModuleComponent],
      declarations: [],
      providers: [
        // ✅ CORRECCIÓN 2: Simulamos la ventana modal
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
