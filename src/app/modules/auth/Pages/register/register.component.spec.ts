import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { RegisterComponent } from './register.component';
import { PersonaService } from '../../../../shared/services/persona.service';
import { UserService } from '../../../../shared/services/user.service';
import { EpsService } from '../../../../shared/services/Hospital/eps.service';
import { DocumentTypeService } from '../../../../shared/services/document-type.service';
import { RolUserService } from '../../../../shared/services/rol-user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    // 1. Crear mocks para TODOS los servicios
    const routerMock = { navigate: jasmine.createSpy('navigate') };
    const personaServiceMock = {
      crear: jasmine.createSpy('crear').and.returnValue(of({})),
    };
    const userServiceMock = {
      crearUsuario: jasmine.createSpy('crearUsuario').and.returnValue(of({})),
    };
    const rolUserServiceMock = {
      crear: jasmine.createSpy('crear').and.returnValue(of({})),
    };

    // Mocks críticos para ngOnInit (deben devolver array vacío para que no falle el .subscribe)
    const epsServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };
    const documentTypeServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent], // ✅ Corrección: va en declarations
      imports: [ReactiveFormsModule], // ✅ Necesario para los formularios
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: PersonaService, useValue: personaServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: EpsService, useValue: epsServiceMock },
        { provide: DocumentTypeService, useValue: documentTypeServiceMock },
        { provide: RolUserService, useValue: rolUserServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Esto dispara ngOnInit y usa nuestros mocks de traerTodo
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
