import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { SidebarComponent } from './sidebar.component';
import { UserService } from '../../services/user.service';
import { AuthService } from './../../services/auth/auth.service';
import { MenuService } from '../../services/Menu/menu.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  // Definir mocks
  let userServiceMock: any;
  let authServiceMock: any;
  let menuServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // 1. Configurar comportamiento de los mocks
    userServiceMock = {
      getMenu: jasmine.createSpy('getMenu').and.returnValue(of([])), // Retorna menú vacío
    };

    authServiceMock = {
      getUserRoleIds: jasmine.createSpy('getUserRoleIds').and.returnValue([1]), // Simula que hay un rol
    };

    menuServiceMock = {
      setMenuItems: jasmine.createSpy('setMenuItems'),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      declarations: [SidebarComponent], // standalone: false, correcto en declarations
      imports: [],
      providers: [
        // 2. Inyectar todos los servicios
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: MenuService, useValue: menuServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
