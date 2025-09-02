import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MenuItem } from '../../Models/ManuItemModel';

import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  standalone:false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  
  @Input() menuItems: MenuItem[]=[]

  activeItem: string = 'dashboard';
  expandedItems: Set<string> = new Set();
  isMobile: boolean = false;

  constructor(private router: Router, private service:UserService) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Inicializar elementos expandidos si es necesario

    this.service.getMenu(4).subscribe({
      next: (menu) => this.menuItems = menu,
      error: (err) => {
        console.error('Error cargando menú', err);
        this.menuItems = [];
      }
    });
    this.initializeExpandedItems();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private initializeExpandedItems(): void {
    // Expandir automáticamente los items que contienen el item activo
    this.menuItems.forEach(group => {
      if (group.children) {
        group.children.forEach(item => {
          if (item.type === 'collapse' && item.children) {
            const hasActiveChild = item.children.some(child => child.id === this.activeItem);
            if (hasActiveChild) {
              this.expandedItems.add(item.id);
            }
          }
        });
      }
    });
  }

selectItem(item: MenuItem): void {
  this.activeItem = item.id;

  if (item.url) {
    this.router.navigate([ item.url]);

  }

  this.onItemSelected(item);
}

  toggleCollapse(itemId: string): void {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
    }
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems.has(itemId);
  }

  private onItemSelected(item: MenuItem): void {
    // Aquí puedes emitir un evento o ejecutar lógica adicional
    console.log('Item selected:', item);
    
    // Ejemplo de emit si necesitas comunicarte con el componente padre
    // this.itemSelected.emit(item);
  }

  // Método para actualizar el menu dinámicamente si es necesario
  updateMenuItems(newMenuItems: MenuItem[]): void {
    this.menuItems = newMenuItems;
    this.initializeExpandedItems();
  }

  // Método para establecer el item activo desde fuera del componente
  setActiveItem(itemId: string): void {
    this.activeItem = itemId;
    this.initializeExpandedItems();
  }
}
