import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../shared/services/user.service';
import Swal from 'sweetalert2';
import { LoginModel } from '../../../../shared/Models/security/userModel';
import { AuthService } from '../../../../shared/services/auth/auth.service';
@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

 loginForm: FormGroup;
  constructor(private router: Router,private fb:FormBuilder,private service : UserService,private authService :AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData: LoginModel = this.loginForm.value;
      this.service.login(loginData).subscribe({
      next: (data) => {
  if (data.requiresTwoFactor) {
    // Redirigir a la vista de 2FA con el userId
    this.router.navigate(['/auth/verify-2fa'], {
      queryParams: { userId: data.userId }
    });

    Swal.fire({
      icon: 'info',
      title: 'Verificación requerida',
      text: 'Revisa tu correo para ingresar el código.'
    });

    return;
  }

  // SI NO requiere 2FA → login normal
  localStorage.setItem('jwt', data.accessToken);
  localStorage.setItem('jwt_expires', data.expiresAtUtc);
  localStorage.setItem('jwt_refresh', data.refreshToken);

  Swal.fire({
    icon: 'success',
    title: '¡Login exitoso!',
    timer: 1500,
    showConfirmButton: false
  });

  this.redirectByRole();
}

,
        error: (err) => {
          console.error('Error de login:', err);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al intentar iniciar sesión. Intenta nuevamente.',
          });
        },
      });
    } else {
      console.log('Formulario inválido');

      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, revisa los campos y asegúrate de que sean correctos.',
      });
    }
  }





// Método para redirigir según el rol del usuario
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





  entrar() {
   
    this.router
      .navigateByUrl('/admin')
      .then((success) => {
     
      })
      .catch((error) => {
        console.error('💥 Error en navegación:', error);
      });
  }
}
