import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // 👈 Importante para ignorar componentes hijos en el HTML
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent], // ✅ CORRECCIÓN: Se mueve de 'imports' a 'declarations'
      imports: [],
      schemas: [NO_ERRORS_SCHEMA], // ✅ TRUCO: Evita errores de "is not a known element" si usas otros componentes en el HTML
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
