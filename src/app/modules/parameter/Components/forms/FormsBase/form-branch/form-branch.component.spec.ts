import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Para animaciones de Material

import { FormBranchComponent } from './form-branch.component';
import { InstitutionService } from '../../../../../../shared/services/institution.service';
import { of } from 'rxjs';

describe('FormBranchComponent', () => {
  let component: FormBranchComponent;
  let fixture: ComponentFixture<FormBranchComponent>;

  beforeEach(async () => {
    // Mock simple del servicio
    const institutionServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [
        FormBranchComponent, // ✅ Standalone va en imports
        BrowserAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: InstitutionService, useValue: institutionServiceMock },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
