import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MenuItem } from '../../Models/ManuItemModel';
import { menuAdmin } from '../../../modules/admin/Menu-config/menu-admin';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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
    this.abrirPerfil.emit(); // Avisamos que el usuario hizo clic
  }
}
