import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { CardTypeCitationComponent } from './card-type-citation.component';

describe('CardTypeCitationComponent', () => {
  let component: CardTypeCitationComponent;
  let fixture: ComponentFixture<CardTypeCitationComponent>;

  beforeEach(async () => {
    // Mock del Router
    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      declarations: [CardTypeCitationComponent], // Correcto
      imports: [],
      providers: [
        { provide: Router, useValue: routerMock }, // ✅ Inyectar mock
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CardTypeCitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
