import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../../shared/services/user.service';

function strongPassword() {
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

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  email = '';
  token = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private users: UserService,
    public router: Router
  ) { }

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    this.email = qp.get('email') || qp.get('Email') || '';
    this.token =
      qp.get('token') || qp.get('code') || qp.get('permission') || qp.get('permiso') || '';

    this.form = this.fb.group({
      email: [{ value: this.email, disabled: true }, [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPassword()]],
      confirmPassword: ['', [Validators.required, match('password')]],
    });

    if (!this.email || !this.token) {
      Swal.fire(
        'Enlace inválido',
        'Faltan parámetros (token o email). Vuelve a solicitar el restablecimiento.',
        'error'
      ).then(() => this.router.navigate(['/auth/forgot-password']));
    }
  }

  get f() { return this.form.controls; }

  submit(): void {
    Object.values(this.f).forEach(c => c.markAsTouched());
    if (this.form.invalid) {
      Swal.fire('Datos inválidos', 'Revisa la contraseña y su confirmación.', 'warning');
      return;
    }

    this.loading = true;
    this.users.resetPassword({
      email: this.email,
      token: this.token,
      newPassword: this.form.getRawValue().password
    }).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('¡Listo!', 'Tu contraseña se actualizó correctamente.', 'success')
          .then(() => this.router.navigate(['/auth/login']));
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'No fue posible actualizar la contraseña.';
        Swal.fire('Ups…', msg, 'error');
      }
    });
  }
}
