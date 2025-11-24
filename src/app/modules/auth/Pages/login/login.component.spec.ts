import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; // 👈 Necesario para tu FormGroup
import { Router } from '@angular/router';
import { of } from 'rxjs'; // Para simular respuestas observables

// Importa tus clases reales
import { LoginComponent } from './login.component';
import { UserService } from '../../../../shared/services/user.service';
import { AuthService } from '../../../../shared/services/auth/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Definimos las variables para los mocks (simulacros)
  let userServiceMock: jasmine.SpyObj<UserService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // 1. Creamos los objetos falsos (espías) con los métodos que usa tu componente
    userServiceMock = jasmine.createSpyObj('UserService', ['login']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getUserRoleIds']);
    routerMock = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

    await TestBed.configureTestingModule({
      // 2. CORRECCIÓN CLAVE: LoginComponent NO es standalone, así que va en 'declarations'
      declarations: [LoginComponent],

      // 3. Importamos módulos necesarios para el HTML/Lógica
      imports: [ReactiveFormsModule],

      // 4. Inyectamos los Mocks en lugar de los servicios reales
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
