import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionesComponent } from './notificaciones.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notification.service';

describe('NotificacionesComponent', () => {
  let component: NotificacionesComponent;
  let fixture: ComponentFixture<NotificacionesComponent>;

  beforeEach(async () => {
    const notificationServiceMock = {
      markAsRead: jasmine.createSpy('markAsRead').and.returnValue(of({})),
      markAsUnread: jasmine.createSpy('markAsUnread').and.returnValue(of({})),
      // Simula la carga inicial de notificaciones
      getByPerson: jasmine.createSpy('getByPerson').and.returnValue(of([])),
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [NotificacionesComponent], // Standalone: true
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
