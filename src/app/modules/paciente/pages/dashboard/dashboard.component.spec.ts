import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
// Servicios
import { CitationService } from '../../../../shared/services/citation.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { RelatedPersonService } from '../../../../shared/services/related-person.service';
import { TypeCitationService } from '../../../../shared/services/Hospital/type-citation.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const citationServiceMock = {
      getPendingCount: jasmine
        .createSpy('getPendingCount')
        .and.returnValue(of(0)),
      traerListado: jasmine.createSpy('traerListado').and.returnValue(of([])),
      getByPerson: jasmine.createSpy('getByPerson').and.returnValue(of([])),
    };

    const notificationServiceMock = {
      getUnreadCount: jasmine
        .createSpy('getUnreadCount')
        .and.returnValue(of(0)),
      getTop3: jasmine.createSpy('getTop3').and.returnValue(of([])),
      // ✅ CORRECCIÓN: Agregamos este método que faltaba
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };

    const relatedPersonServiceMock = {
      getByPerson: jasmine.createSpy('getByPerson').and.returnValue(of([])),
    };

    const typeCitationServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent], // Es standalone
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: CitationService, useValue: citationServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: RelatedPersonService, useValue: relatedPersonServiceMock },
        { provide: TypeCitationService, useValue: typeCitationServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
