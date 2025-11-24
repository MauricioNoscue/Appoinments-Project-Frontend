import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs'; // 1. Importante para simular respuestas

import { HomePanelComponent } from './home-panel.component';
import { UserService } from '../../../../shared/services/user.service';

describe('HomePanelComponent', () => {
  let component: HomePanelComponent;
  let fixture: ComponentFixture<HomePanelComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>; // 2. Variable para el mock

  beforeEach(async () => {
    // 3. Creamos el espía con el método 'traerTodo' que usa tu ngOnInit
    userServiceMock = jasmine.createSpyObj('UserService', ['traerTodo']);

    // 4. Configuramos que 'traerTodo' devuelva una lista vacía (Observable)
    // Si no haces esto, el test fallará al intentar hacer .subscribe()
    userServiceMock.traerTodo.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [HomePanelComponent], // Es standalone: false, así que va aquí
      imports: [],
      providers: [
        // 5. Inyectamos el mock en lugar del servicio real
        { provide: UserService, useValue: userServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Esto dispara ngOnInit y usa nuestro mock
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
