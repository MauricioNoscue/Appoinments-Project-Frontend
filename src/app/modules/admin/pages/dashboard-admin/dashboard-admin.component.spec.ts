import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs'; // Necesario para simular respuestas

import { DashboardAdminComponent } from './dashboard-admin.component';
import { DashboardFacadeService } from '../../../../shared/services/DashboardService';
import { DoctorService } from '../../../../shared/services/doctor.service';

describe('DashboardAdminComponent', () => {
  let component: DashboardAdminComponent;
  let fixture: ComponentFixture<DashboardAdminComponent>;

  // Mocks (Espías)
  let facadeMock: any;
  let doctorServiceMock: any;

  beforeEach(async () => {
    // 1. Crear servicios falsos
    facadeMock = {
      dashboard$: of(null), // Simulamos que el dashboard devuelve null o datos vacíos
      loadDashboardData: jasmine.createSpy('loadDashboardData'), // Simulamos el método void
    };

    doctorServiceMock = {
      traerDoctorPersona2: jasmine
        .createSpy('traerDoctorPersona2')
        .and.returnValue(of([])), // Simulamos lista vacía de doctores
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardAdminComponent], // Es standalone: false, va aquí
      imports: [],
      providers: [
        // 2. Inyectar los servicios falsos
        { provide: DashboardFacadeService, useValue: facadeMock },
        { provide: DoctorService, useValue: doctorServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
