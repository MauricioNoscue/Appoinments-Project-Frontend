import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ Necesario para Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormRelacionPersonaComponent } from './form-relacion-persona.component';

describe('FormRelacionPersonaComponent', () => {
  let component: FormRelacionPersonaComponent;
  let fixture: ComponentFixture<FormRelacionPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ✅ CORRECCIÓN 1: Es standalone, va en imports
      imports: [
        FormRelacionPersonaComponent,
        BrowserAnimationsModule, // Evita errores de animaciones de Material
      ],
      providers: [
        // ✅ CORRECCIÓN 2: Simulamos los datos que recibe el modal
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormRelacionPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
