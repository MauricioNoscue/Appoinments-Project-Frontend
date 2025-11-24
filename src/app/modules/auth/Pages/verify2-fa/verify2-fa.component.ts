import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../../shared/services/user.service';
import { AuthService } from '../../../../shared/services/auth/auth.service';
@Component({
  selector: 'app-verify2-fa',
  standalone: false,
  templateUrl: './verify2-fa.component.html',
  styleUrl: './verify2-fa.component.css'
})
export class Verify2FAComponent {


    form: FormGroup;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private authService :AuthService
  ) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    // Obtener el userId que mandaste desde login
    this.userId = Number(this.route.snapshot.queryParamMap.get('userId'));
  }

  submit() {
    if (this.form.invalid) return;

    const payload = {
      userId: this.userId,
      code: this.form.value.code
    };

    this.userService.verify2FA(payload).subscribe({
      next: (data) => {
        // Guardar tokens
        localStorage.setItem('jwt', data.accessToken);
        localStorage.setItem('jwt_expires', data.expiresAtUtc);
        localStorage.setItem('jwt_refresh', data.refreshToken);

        Swal.fire({
          icon: 'success',
          title: 'Código correcto',
          text: 'Inicio de sesión exitoso',
          timer: 1500,
          showConfirmButton: false
        });

       this.redirectByRole();
      },

      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Código incorrecto',
          text: 'El código ingresado no es válido.'
        });
      }
    });
  }




  redirectByRole(): void {
  const roleIds = this.authService.getUserRoleIds(); // obtiene lista de roles
  const firstRoleId = roleIds?.[0]; // toma el primero (maneja null/undefined)

  switch (firstRoleId) {
    case 4:
      // 👤 Rol administrador
      this.router.navigate(['/admin']);
      break;

    case 2:
      // 👤 Rol paciente
      this.router.navigate(['/paciente']);
      break;
       case 3:
      // 👤 Rol paciente
      this.router.navigate(['/doctor']);
      break;

    default:
      // 👤 Sin rol o no coincide
      this.router.navigate(['/']);
      break;
  }
}
}
