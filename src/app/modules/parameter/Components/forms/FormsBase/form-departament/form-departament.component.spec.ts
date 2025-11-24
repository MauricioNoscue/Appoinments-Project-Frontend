import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormDepartamentComponent } from './form-departament.component';

describe('FormDepartamentComponent', () => {
  let component: FormDepartamentComponent;
  let fixture: ComponentFixture<FormDepartamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormDepartamentComponent, // ✅ Standalone va en imports
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: 'MODAL_DATA', useValue: {} }, // ✅ Proveedor extra que usa tu componente
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDepartamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
