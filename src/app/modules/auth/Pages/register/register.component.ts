import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { PersonaService } from '../../../../shared/services/persona.service';
import { UserService } from '../../../../shared/services/user.service';

/* ===== Validadores reutilizables ===== */
function onlyLetters() {
  const re = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
  return (c: AbstractControl): ValidationErrors | null =>
    !c.value ? null : re.test(c.value) ? null : { onlyLetters: true };
}
function onlyDigits(lenMin = 0, lenMax = 99) {
  const re = new RegExp(`^[0-9]{${lenMin},${lenMax}}$`);
  return (c: AbstractControl): ValidationErrors | null =>
    !c.value ? null : re.test(c.value) ? null : { onlyDigits: true };
}
function dateNotInFuture() {
  return (c: AbstractControl): ValidationErrors | null => {
    if (!c.value) return null;
    const v = new Date(c.value);
    const today = new Date();
    v.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return v > today ? { futureDate: true } : null;
  };
}
function strongPassword() {
  // min 8, 1 mayus, 1 minus, 1 número, 1 especial
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return (c: AbstractControl): ValidationErrors | null =>
    !c.value ? null : re.test(c.value) ? null : { weak: true };
}
function match(other: string) {
  return (c: AbstractControl): ValidationErrors | null => {
    const parent = c.parent as FormGroup | null;
    if (!parent) return null;
    return c.value === parent.get(other)?.value ? null : { mismatch: true };
  };
}
/** Celular colombiano: 10 dígitos y empieza por 3 (ej: 3xxxxxxxxx).
 *  Si quieres aceptar fijos 60xxxxxxxx, cambia el validador abajo. */
function coCellphone() {
  const re = /^3\d{9}$/;
  return (c: AbstractControl): ValidationErrors | null =>
    !c.value ? null : re.test(c.value) ? null : { coPhone: true };
}

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  step = 1; // 1 = Persona, 2 = Usuario
  personForm!: FormGroup;
  userForm!: FormGroup;

  creandoPersona = false;
  creandoUsuario = false;
  personaIdCreada: number | null = null;

  tiposDocumento = [
    { id: 1, nombre: 'Cédula de ciudadanía' },
    { id: 2, nombre: 'Tarjeta de identidad' },
    { id: 3, nombre: 'Cédula de extranjería' },
    { id: 4, nombre: 'Pasaporte' },
  ];
  epsOptions = [
    { id: 1, nombre: 'Sura' },
    { id: 2, nombre: 'Nueva EPS' },
    { id: 3, nombre: 'Sanitas' },
    { id: 4, nombre: 'Compensar' },
    { id: 5, nombre: 'Famisanar' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    /* Paso 1: Persona (TODOS los campos de Persona) */
    this.personForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60), onlyLetters()]],
      fullLastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60), onlyLetters()]],
      documentTypeId: ['', [Validators.required]],
      document: ['', [Validators.required, onlyDigits(6, 12)]],
      dateBorn: [null, [Validators.required, dateNotInFuture()]],
      phoneNumber: ['', [Validators.required, coCellphone()]], // celular colombiano
      epsId: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      healthRegime: ['', [Validators.required]],
    });

    /* Paso 2: Usuario (solo credenciales) */
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
      password: ['', [Validators.required, strongPassword()]],
      confirmPassword: ['', [Validators.required, match('password')]],
    });

    // si quisieras llevar el email del paso 2 al login luego, lo tienes en this.userForm.value.email
    this.userForm
      .get('password')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.userForm.get('confirmPassword')!.updateValueAndValidity({ onlySelf: true }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ===== Navegación / Animación ===== */
  goStep2(): void {
    Object.values(this.personForm.controls).forEach(c => c.markAsTouched());
    if (this.personForm.invalid) {
      Swal.fire('Revisa los campos', 'Aún hay datos pendientes o con formato inválido.', 'warning');
      return;
    }
    this.step = 2;
  }

  goLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  /* ===== Persistencia ===== */
  private crearPersona(): Promise<number> {
    const p = this.personForm.value;
    const body = {
      fullName: p.fullName,
      fullLastName: p.fullLastName,
      documentTypeId: Number(p.documentTypeId),
      document: p.document,
      dateBorn: p.dateBorn,
      phoneNumber: p.phoneNumber,
      epsId: Number(p.epsId),
      gender: p.gender,
      healthRegime: p.healthRegime,
    };

    this.creandoPersona = true;
    return new Promise<number>((resolve, reject) => {
      this.personaService.crear(body).subscribe({
        next: (res: any) => {
          this.creandoPersona = false;
          const id = res?.id ?? res?.Id ?? null;
          if (!id) return reject(new Error('No se recibió el Id de la Persona'));
          resolve(id);
        },
        error: (err) => {
          this.creandoPersona = false;
          reject(err);
        },
      });
    });
  }

  submitFinal(): void {
    Object.values(this.userForm.controls).forEach(c => c.markAsTouched());
    if (this.userForm.invalid) {
      Swal.fire('Revisa los campos', 'El correo/contraseña no cumplen con el formato requerido.', 'warning');
      return;
    }

    (async () => {
      try {
        if (!this.personaIdCreada) {
          this.personaIdCreada = await this.crearPersona();
        }

        const u = this.userForm.value;
        const userPayload: any = {
          // usa los nombres que tu API espera; dejo alias para no fallar por casing
          email: u.email,
          Email: u.email,
          password: u.password,
          Password: u.password,
          personId: this.personaIdCreada,
          PersonId: this.personaIdCreada,
          IdPerson: this.personaIdCreada,
        };

        this.creandoUsuario = true;
        this.userService.crear(userPayload).subscribe({
          next: () => {
            this.creandoUsuario = false;
            Swal.fire('¡Cuenta creada!', 'Ya puedes iniciar sesión.', 'success').then(() => {
              this.router.navigate(['/auth/login']);
            });
          },
          error: (err) => {
            this.creandoUsuario = false;
            Swal.fire('No fue posible crear el usuario', this.parseErr(err), 'error');
          },
        });
      } catch (e) {
        Swal.fire('No fue posible registrar la persona', this.parseErr(e), 'error');
      }
    })();
  }

  private parseErr(err: any): string {
    return err?.error?.message || err?.message || 'Intenta nuevamente.';
  }

  // accesos rápidos desde el template
  get pf() { return this.personForm.controls; }
  get uf() { return this.userForm.controls; }
}
