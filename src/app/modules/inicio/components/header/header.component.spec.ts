import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    // 1. Mock para BreakpointObserver (simula si es celular o pc)
    const breakpointObserverMock = {
      observe: jasmine
        .createSpy('observe')
        .and.returnValue(of({ matches: false })),
    };

    // 2. Mock para Router
    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent], // Correcto: es standalone: false
      imports: [],
      providers: [
        // 3. Inyectar los mocks necesarios
        { provide: BreakpointObserver, useValue: breakpointObserverMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
