import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { UserCreateComponent } from './user-create.component';
import { PersonaService } from '../../../../../../shared/services/persona.service';
import { UserService } from '../../../../../../shared/services/user.service';

describe('UserCreateComponent', () => {
  let component: UserCreateComponent;
  let fixture: ComponentFixture<UserCreateComponent>;

  beforeEach(async () => {
    // Mocks
    const personaServiceMock = {
      crear: jasmine.createSpy('crear').and.returnValue(of({ id: 1 })),
    };
    const userServiceMock = {
      crear: jasmine.createSpy('crear').and.returnValue(of({})),
    };
    const routerMock = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      declarations: [UserCreateComponent], // Correcto
      providers: [
        { provide: PersonaService, useValue: personaServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
