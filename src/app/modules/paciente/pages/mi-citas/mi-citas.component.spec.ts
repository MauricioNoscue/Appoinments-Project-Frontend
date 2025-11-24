import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiCitasComponent } from './mi-citas.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CitationService } from '../../../../shared/services/citation.service';

describe('MiCitasComponent', () => {
  let component: MiCitasComponent;
  let fixture: ComponentFixture<MiCitasComponent>;

  beforeEach(async () => {
    const citationServiceMock = {
      // Métodos que usa tu componente
      getByPerson: jasmine.createSpy('getByPerson').and.returnValue(of([])),
      actualizar: jasmine.createSpy('actualizar').and.returnValue(of({})),
      traerListado: jasmine.createSpy('traerListado').and.returnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [MiCitasComponent], // ✅ Standalone va en imports
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CitationService, useValue: citationServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MiCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
