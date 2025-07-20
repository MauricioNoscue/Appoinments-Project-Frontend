// sidebar.component.ts
import { Component, OnInit, HostListener } from '@angular/core';

export interface MenuItem {
  id: string;
  title: string;
  type: 'group' | 'item' | 'collapse';
  icon?: string;
  url?: string;
  classes?: string;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: false
})
export class SidebarComponent implements OnInit {
  
  menuItems: MenuItem[] = [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          classes: 'nav-item',
          url: '/dashboard',
          icon: 'dashboard',
          target: false,
          breadcrumbs: true
        }
      ]
    },
    {
      id: 'auth',
      title: 'Authentication',
      type: 'group',
      children: [
        {
          id: 'login',
          title: 'Login',
          type: 'item',
          classes: 'nav-item',
          url: '/auth/login',
          icon: 'login',
          target: true,
          breadcrumbs: false
        },
        {
          id: 'register',
          title: 'Register',
          type: 'item',
          classes: 'nav-item',
          url: '/auth/register',
          icon: 'person_add',
          target: true,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'ui-components',
      title: 'UI Components',
      type: 'group',
      children: [
        {
          id: 'typography',
          title: 'Typography',
          type: 'item',
          classes: 'nav-item',
          url: '/ui/typography',
          icon: 'text_fields',
          target: false,
          breadcrumbs: true
        },
        {
          id: 'color',
          title: 'Color',
          type: 'item',
          classes: 'nav-item',
          url: '/ui/color',
          icon: 'palette',
          target: false,
          breadcrumbs: true
        },
        {
          id: 'tables',
          title: 'Tables',
          type: 'item',
          classes: 'nav-item',
          url: '/ui/tables',
          icon: 'table_chart',
          target: false,
          breadcrumbs: true
        }
      ]
    },
    {
      id: 'Módulos',
      title: 'Módulos',
      type: 'group',
      children: [
        {
          id: 'menu-levels',
          title: 'Menu Levels',
          type: 'collapse',
          icon: 'layers',
          children: [
            {
              id: 'level-1-1',
              title: 'Level 1.1',
              type: 'item',
              url: '/menu/level1-1'
            },
            {
              id: 'level-1-2',
              title: 'Menu Level 2.2',
              type: 'item',
              url: '/menu/level1-2'
            },
            {
              id: 'level-1-3',
              title: 'Menu Level 2.3',
              type: 'item',
              url: '/menu/level1-3'
            }
          ]
        },
        {
          id: 'sample-page',
          title: 'Sample Page',
          type: 'item',
          classes: 'nav-item',
          url: '/sample-page',
          icon: 'description',
          target: false,
          breadcrumbs: true
        }
      ]
    }
  ];

  activeItem: string = 'dashboard';
  expandedItems: Set<string> = new Set();
  isMobile: boolean = false;

  constructor() {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Inicializar elementos expandidos si es necesario
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
    
    // Aquí puedes agregar la lógica de navegación
    if (item.url) {
      // Ejemplo: this.router.navigate([item.url]);
      console.log('Navigating to:', item.url);
    }
    
    // Emitir evento si es necesario
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