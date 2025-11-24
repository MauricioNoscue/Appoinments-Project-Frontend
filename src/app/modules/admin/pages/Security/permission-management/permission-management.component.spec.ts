import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select'; // 1. Agregar
import { MatFormFieldModule } from '@angular/material/form-field'; // 2. Agregar
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // 3. Necesario para componentes de Material
import { of } from 'rxjs';

import { PermissionManagementComponent } from './permission-management.component';
import { RolService } from '../../../../../shared/services/rol.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { RolFormPermissionService } from '../../../../../shared/services/rol-form-permission.service';

describe('PermissionManagementComponent', () => {
  let component: PermissionManagementComponent;
  let fixture: ComponentFixture<PermissionManagementComponent>;

  // Mocks
  let rolServiceMock: any;
  let formServiceMock: any;
  let permissionServiceMock: any;
  let rolFormPermissionServiceMock: any;
  let snackBarMock: any;

  beforeEach(async () => {
    // Configurar Mocks
    rolServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };
    formServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };
    permissionServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };
    rolFormPermissionServiceMock = {
      assignPermissions: jasmine
        .createSpy('assignPermissions')
        .and.returnValue(of({})),
      updatePermissions: jasmine
        .createSpy('updatePermissions')
        .and.returnValue(of({})),
    };
    snackBarMock = { open: jasmine.createSpy('open') };

    await TestBed.configureTestingModule({
      declarations: [PermissionManagementComponent], // standalone: false
      imports: [
        ReactiveFormsModule,
        MatSelectModule, // ✅ Soluciona "No value accessor"
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule, // ✅ Evita errores de animaciones
      ],
      providers: [
        { provide: RolService, useValue: rolServiceMock },
        { provide: FormService, useValue: formServiceMock },
        { provide: PermissionService, useValue: permissionServiceMock },
        {
          provide: RolFormPermissionService,
          useValue: rolFormPermissionServiceMock,
        },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
