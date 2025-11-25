import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MenuItem } from '../../Models/ManuItemModel';
import { menuAdmin } from '../../../modules/admin/Menu-config/menu-admin';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { SignalRNotificationService } from '../../services/Socket/signal-rnotification.service';

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
    lastNotification: any | null = null;

  @Output() abrirPerfil = new EventEmitter<void>(); // Evento para abrir el perfil
  @Output() onSearch = new EventEmitter<string>(); 

  searchTerm = '';

  constructor(private router: Router,private authservice:AuthService,   private signalR: SignalRNotificationService,) {}

 ngOnInit(): void {
    this.initializeFromRoute();
    this.checkScreenSize();

    // 🔥 Conectamos al hub usando el token
    const token = this.authservice.getToken();

    if (token) {
      console.log("📡 Dashboard está iniciando SignalR");
      this.signalR.startConnection(token);


      this.signalR.messages$.subscribe(msg => {
  console.log("🔥 LLEGÓ A DASHBOARD:", msg);
  this.lastNotification = msg;
});

    }
  }

    handleSearch() {
    this.onSearch.emit(this.searchTerm.trim());
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
    text: 'Vas a cerrar sesión de tu cuenta actual',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
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
