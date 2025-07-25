import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone:false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  constructor(private router: Router) {}
// En LoginComponent
entrar() {
  console.log('🚀 INICIANDO NAVEGACIÓN DESDE LOGIN');
  console.log('📍 URL actual:', this.router.url);
  
  this.router.navigateByUrl('/admin').then(success => {
    console.log('✅ navigateByUrl resultado:', success);
    console.log('📍 Nueva URL después de navigateByUrl:', this.router.url);
  }).catch(error => {
    console.error('💥 Error en navegación:', error);
  });
}
}
