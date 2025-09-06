import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../../../shared/services/user.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private users: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(120)
      ]],
    });
  }

  get f() { return this.form.controls; }

  submit(): void {
    // toca marcar controles para mostrar errores
    Object.values(this.f).forEach(c => c.markAsTouched());

    if (this.form.invalid) {
      Swal.fire('Correo inválido', 'Ingresa un correo electrónico válido.', 'warning');
      return;
    }

    const email = String(this.form.value.email || '').trim();
    this.loading = true;

    // Loader mientras corre la petición
    Swal.fire({
      title: 'Enviando...',
      text: 'Espera unos minutos',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    this.users
      .forgotPassword(email)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          // Reemplaza el loader con el success
          Swal.fire({
            icon: 'success',
            title: '¡Revisa tu correo!',
            text: 'Te enviamos un enlace para restablecer tu contraseña.',
            confirmButtonText: 'Ir a iniciar sesión',
          }).then(() => this.router.navigate(['/auth/login']));
        },
        error: (err) => {
          const msg = err?.error?.message || 'No fue posible procesar la solicitud.';
          Swal.fire({
            icon: 'error',
            title: 'Ups…',
            text: msg,
            confirmButtonText: 'Entendido',
          });
        },
      });
  }

  goLogin(): void {
    if (this.loading) return;
    this.router.navigate(['/auth/login']);
  }
}
