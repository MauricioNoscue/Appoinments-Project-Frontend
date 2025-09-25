import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MenuItem } from '../../Models/ManuItemModel';
import { menuAdmin } from '../../../modules/admin/Menu-config/menu-admin';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-layout-component',
  standalone: false,
  templateUrl: './dashboard-layout-component.component.html',
  styleUrl: './dashboard-layout-component.component.css',
})
export class DashboardLayoutComponentComponent implements OnInit {
  menuItems: MenuItem[] = [];
  tipoUsuario: 'admin' | 'doctor' | 'paciente' = 'admin';
  isMobile = false; // SOLO AGREGAR ESTA LÍNEA

  @Output() abrirPerfil = new EventEmitter<void>(); // Evento para abrir el perfil

  constructor(private router: Router,private authservice:AuthService) {}

  ngOnInit(): void {
    this.initializeFromRoute();
    this.checkScreenSize(); // AGREGAR ESTA LÍNEA
  }

  // AGREGAR ESTOS MÉTODOS
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

CerrarSession(): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Vas a cerrar sesión',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  }).then((result1) => {
    if (result1.isConfirmed) {
      Swal.fire({
        title: '¿Completamente seguro?',
        text: 'Esta acción cerrará tu sesión actual',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
      }).then((result2) => {
        if (result2.isConfirmed) {
          Swal.fire({
            title: '¿Muy muy seguro?',
            text: 'Ya no podrás deshacer esta acción',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
          }).then((result3) => {
            if (result3.isConfirmed) {
              // 👇 Ejecuta el logout
              this.authservice.logout();
              this.router.navigate(['/']);
              Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Has cerrado sesión correctamente',
                timer: 2000,
                showConfirmButton: false
              });
            }
          });
        }
      });
    }
  });
}



  private initializeFromRoute(): void {
    const url = this.router.url;

    if (url.startsWith('/admin')) {
      this.tipoUsuario = 'admin';
      this.menuItems = menuAdmin;
    } else if (url.startsWith('/doctor')) {
      this.tipoUsuario = 'doctor';
      // this.menuItems = menuDoctor;
    } else if (url.startsWith('/paciente')) {
      this.tipoUsuario = 'paciente';
      // this.menuItems = menuPaciente;
    }
  }
  onClickPerfil() {
     this.router.navigate(['/paciente/perfil']);
  }
}
