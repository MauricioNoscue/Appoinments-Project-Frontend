import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { FormCityComponent } from './form-city.component';
import { DepartamentService } from '../../../../../../shared/services/departament.service';

describe('FormCityComponent', () => {
  let component: FormCityComponent;
  let fixture: ComponentFixture<FormCityComponent>;

  beforeEach(async () => {
    const departamentServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [
        FormCityComponent, // ✅ Standalone va en imports
        BrowserAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DepartamentService, useValue: departamentServiceMock },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
