import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { PersonaService } from '../../../../shared/services/persona.service';
import { UserService } from '../../../../shared/services/user.service';
import { EpsService } from '../../../../shared/services/Hospital/eps.service';
import { DocumentTypeService } from '../../../../shared/services/document-type.service';
import { RolUserService } from '../../../../shared/services/rol-user.service';
import { EpsList } from '../../../../shared/Models/hospital/epsListModel';
import { DocumentType } from '../../../../shared/Models/documentTypeModel';

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
  isRegistering = false;
  personaIdCreada: number | null = null;

  tiposDocumento: DocumentType[] = [];
  epsOptions: EpsList[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private userService: UserService,
    private router: Router,
    private epsService: EpsService,
    private documentTypeService: DocumentTypeService,
    private rolUserService: RolUserService
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

    // Cargar datos dinámicos
    this.loadDocumentTypes();
    this.loadEpsOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDocumentTypes(): void {
    this.documentTypeService.traerTodo().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: DocumentType[]) => {
        this.tiposDocumento = data;
      },
      error: (err) => {
        console.error('Error cargando tipos de documento:', err);
        Swal.fire('Error', 'No se pudieron cargar los tipos de documento.', 'error');
      }
    });
  }

  private loadEpsOptions(): void {
    this.epsService.traerTodo().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: EpsList[]) => {
        this.epsOptions = data;
      },
      error: (err) => {
        console.error('Error cargando EPS:', err);
        Swal.fire('Error', 'No se pudieron cargar las EPS.', 'error');
      }
    });
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

  goBack(): void {
    this.step = 1;
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

    this.isRegistering = true;

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
          next: (res: any) => {
            this.creandoUsuario = false;
            const userId = res?.id ?? res?.Id ?? null;
            if (!userId) {
              this.isRegistering = false;
              Swal.fire('Error', 'No se pudo obtener el ID del usuario creado.', 'error');
              return;
            }

            // Crear RolUser
            const rolUserPayload: any = {
              rolId: 2, // Id del rol "Paciente" para que siempre sea paciente por defecto
              userId: userId
            };

            this.rolUserService.crear(rolUserPayload).subscribe({
              next: () => {
                this.isRegistering = false;
                Swal.fire('¡Cuenta creada!', 'Ya puedes iniciar sesión.', 'success').then(() => {
                  this.router.navigate(['/auth/login']);
                });
              },
              error: (err) => {
                this.isRegistering = false;
                console.error('Error creando RolUser:', err);
                Swal.fire('Cuenta creada, pero error asignando rol', 'La cuenta se creó, pero hubo un problema asignando el rol. Contacta al administrador.', 'warning').then(() => {
                  this.router.navigate(['/auth/login']);
                });
              }
            });
          },
          error: (err) => {
            this.creandoUsuario = false;
            this.isRegistering = false;
            const friendly = this.getFriendlyErrorMessage(err);
            if (friendly.field) {
              this.uf[friendly.field].setErrors({ duplicate: true });
            }
            Swal.fire('No fue posible crear el usuario', friendly.message, 'error');
          },
        });
      } catch (e) {
        this.isRegistering = false;
        const friendly = this.getFriendlyErrorMessage(e);
        if (friendly.field) {
          this.pf[friendly.field].setErrors({ duplicate: true });
        }
        Swal.fire('No fue posible registrar la persona', friendly.message, 'error');
      }
    })();
  }

  private parseErr(err: any): string {
    // Handle HttpErrorResponse
    if (err?.status) {
      // For HTTP errors, try to get the message from the response body
      const serverMessage = err?.error?.message || err?.error?.Message || err?.error;
      if (serverMessage && typeof serverMessage === 'string') {
        return serverMessage;
      }
      // If no specific message, provide a generic one based on status
      if (err.status === 400) {
        return 'Datos inválidos o ya registrados. Verifica la información.';
      }
      if (err.status === 409) {
        return 'Conflicto: algunos datos ya existen.';
      }
    }
    // Fallback for other error types
    return err?.error?.message || err?.message || 'Intenta nuevamente.';
  }

  private getFriendlyErrorMessage(err: any): { message: string, field?: string } {
    const errorMsg = this.parseErr(err).toLowerCase();

    // Check for specific duplicate field messages
    if (errorMsg.includes('email') || errorMsg.includes('correo')) {
      if (errorMsg.includes('exist') || errorMsg.includes('registrado') || errorMsg.includes('duplicate') || errorMsg.includes('ya existe')) {
        return { message: 'El correo electrónico ya está registrado. Por favor, utiliza otro correo.', field: 'email' };
      }
    }

    if (errorMsg.includes('document') || errorMsg.includes('documento')) {
      if (errorMsg.includes('exist') || errorMsg.includes('registrado') || errorMsg.includes('duplicate') || errorMsg.includes('ya existe')) {
        return { message: 'El número de documento ya está registrado. Verifica tus datos.', field: 'document' };
      }
    }

    if (errorMsg.includes('phone') || errorMsg.includes('teléfono') || errorMsg.includes('telefono')) {
      if (errorMsg.includes('exist') || errorMsg.includes('registrado') || errorMsg.includes('duplicate') || errorMsg.includes('ya existe')) {
        return { message: 'El número de teléfono ya está registrado. Utiliza otro número.', field: 'phoneNumber' };
      }
    }

    // Check for general duplicate messages
    if (errorMsg.includes('duplicate') || errorMsg.includes('duplicado') || errorMsg.includes('ya existe') || errorMsg.includes('ya está registrado')) {
      return { message: 'Algunos datos ya están registrados. Revisa la información proporcionada.' };
    }

    // Check for 400 status (bad request) which often indicates validation/duplication errors
    if (err?.status === 400) {
      return { message: 'Los datos proporcionados no son válidos o ya están registrados. Verifica la información.' };
    }

    return { message: this.parseErr(err) };
  }

  // accesos rápidos desde el template
  get pf() { return this.personForm.controls; }
  get uf() { return this.userForm.controls; }
}
