import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

// ✅ IMPORTACIONES CLAVE PARA CORREGIR EL ERROR NG01203
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UserRoleManagementComponent } from './user-role-management.component';
import { UserService } from '../../../../../shared/services/user.service';
import { RolService } from '../../../../../shared/services/rol.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { RolFormPermissionService } from '../../../../../shared/services/rol-form-permission.service';

describe('UserRoleManagementComponent', () => {
  let component: UserRoleManagementComponent;
  let fixture: ComponentFixture<UserRoleManagementComponent>;

  beforeEach(async () => {
    // 1. Mocks de todos los servicios
    const userServiceMock = {
      getUserDetail: jasmine.createSpy('getUserDetail').and.returnValue(of({})),
      getRolesAndPermissions: jasmine
        .createSpy('getRolesAndPermissions')
        .and.returnValue(of([])),
    };

    const rolServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };

    const formServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };

    const permissionServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
    };

    const rolFormPermissionServiceMock = {
      assignMultipleRoles: jasmine
        .createSpy('assignMultipleRoles')
        .and.returnValue(of({})),
      updateUserRoles: jasmine
        .createSpy('updateUserRoles')
        .and.returnValue(of({})),
    };

    const snackBarMock = {
      open: jasmine.createSpy('open'),
    };

    const dialogMock = {
      open: () => ({ afterClosed: () => of(null) }),
    };

    await TestBed.configureTestingModule({
      declarations: [UserRoleManagementComponent], // ✅ Correcto: es standalone: false
      imports: [
        ReactiveFormsModule,
        // ✅ Estos módulos arreglan el error del formulario y el mat-select
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
        { provide: RolService, useValue: rolServiceMock },
        { provide: FormService, useValue: formServiceMock },
        { provide: PermissionService, useValue: permissionServiceMock },
        {
          provide: RolFormPermissionService,
          useValue: rolFormPermissionServiceMock,
        },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRoleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
