import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
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

  constructor(private fb: FormBuilder, private users: UserService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    });
  }

  get f() { return this.form.controls; }

  submit(): void {
    Object.values(this.f).forEach(c => c.markAsTouched());
    if (this.form.invalid) {
      Swal.fire('Correo inválido', 'Ingresa un correo electrónico válido.', 'warning');
      return;
    }

    this.loading = true;
    this.users.forgotPassword(this.form.value.email).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire(
          '¡Revisa tu correo!',
          'Te enviamos un enlace para restablecer tu contraseña.',
          'success'
        ).then(() => this.router.navigate(['/auth/login']));
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'No fue posible procesar la solicitud.';
        Swal.fire('Ups…', msg, 'error');
      }
    });
  }

  goLogin(): void { this.router.navigate(['/auth/login']); }
}
