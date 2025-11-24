import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalSearchComponent } from './global-search.component';
import { MenuService } from '../../../services/Menu/menu.service';

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let fixture: ComponentFixture<GlobalSearchComponent>;

  beforeEach(async () => {
    // Mocks
    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };
    const menuServiceMock = {
      getCurrentMenu: jasmine.createSpy('getCurrentMenu').and.returnValue([]), // Retorna lista vacía
    };

    await TestBed.configureTestingModule({
      declarations: [GlobalSearchComponent], // Correcto
      imports: [],
      providers: [
        // ✅ Inyectamos dependencias
        { provide: Router, useValue: routerMock },
        { provide: MenuService, useValue: menuServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
