import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router'; // Importante
import { of } from 'rxjs';

import { ViewCitationAvailableComponent } from './view-citation-available.component';
import { CoreCitationService } from '../../../../shared/services/Hospital/core-citation.service';

describe('ViewCitationAvailableComponent', () => {
  let component: ViewCitationAvailableComponent;
  let fixture: ComponentFixture<ViewCitationAvailableComponent>;

  beforeEach(async () => {
    const coreCitationServiceMock = {
      // Agrega aquí métodos si el componente los llama en ngOnInit
      // Por ejemplo: getCitas: () => of([])
    };

    await TestBed.configureTestingModule({
      declarations: [ViewCitationAvailableComponent], // Correcto
      imports: [],
      providers: [
        provideRouter([]), // Soluciona el error de ActivatedRoute
        { provide: CoreCitationService, useValue: coreCitationServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewCitationAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
