import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { DashboardLayoutComponentComponent } from './dashboard-layout-component.component';
import { AuthService } from '../../services/auth/auth.service';

describe('DashboardLayoutComponentComponent', () => {
  let component: DashboardLayoutComponentComponent;
  let fixture: ComponentFixture<DashboardLayoutComponentComponent>;

  beforeEach(async () => {
    // Mocks de los servicios
    const authServiceMock = {
      logout: jasmine.createSpy('logout'),
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
      url: '/admin/dashboard', // Simulamos una URL para que initializeFromRoute no falle
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardLayoutComponentComponent], // Correcto
      imports: [],
      providers: [
        // ✅ Inyectamos las dependencias faltantes
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLayoutComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
