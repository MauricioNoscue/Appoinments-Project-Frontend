import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router'; // 1. Importar esto
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { RelacionPersonaComponent } from './relacion-persona.component';
import { RelatedPersonService } from '../../../../shared/services/related-person.service';

describe('RelacionPersonaComponent', () => {
  let component: RelacionPersonaComponent;
  let fixture: ComponentFixture<RelacionPersonaComponent>;

  beforeEach(async () => {
    const relatedPersonServiceMock = {
      getByPerson: jasmine.createSpy('getByPerson').and.returnValue(of([])),
      crear: jasmine.createSpy('crear').and.returnValue(of({})),
      editar: jasmine.createSpy('editar').and.returnValue(of({})),
      eliminar: jasmine.createSpy('eliminar').and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [RelacionPersonaComponent], // Es standalone
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]), // 2. AGREGAR ESTO (Soluciona el error ActivatedRoute)
        { provide: RelatedPersonService, useValue: relatedPersonServiceMock },
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(null) }) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RelacionPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
