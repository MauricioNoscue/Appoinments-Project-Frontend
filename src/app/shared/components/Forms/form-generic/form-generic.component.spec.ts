import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormGenericComponent } from './form-generic.component';

describe('FormGenericComponent', () => {
  let component: FormGenericComponent;
  let fixture: ComponentFixture<FormGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGenericComponent], // ✅ CORRECTO: Al ser standalone, va aquí
      declarations: [], // ❌ ELIMINADO: No debe estar aquí
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
