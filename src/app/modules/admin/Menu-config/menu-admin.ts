import { MenuItem } from "../../../shared/Models/ManuItemModel";



export const menuAdmin: MenuItem[] = [

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
          url: '/admin/dashboard',
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
          id: 'menu-secutiry',
          title: 'Seguridad',
          type: 'collapse',
          icon: 'layers',
          children: [
            {
              id: 'rol1-1',
              title: 'Roles',
              type: 'item',
              url: 'admin/security/rol'
            },
            {
              id: 'User-1-2',
              title: 'Usuarios',
              type: 'item',
              url: 'admin/security/user'
            },
            {
              id: 'module-1-3',
              title: 'Modulos',
              type: 'item',
              url: 'admin/security/module'
            }
          ]
        },    {
      id: 'menu-security-2',
      title: 'Parámetros',
      type: 'collapse',
      icon: 'layers',
      children: [
        {
          id: 'rol-2',
          title: 'Roles',
          type: 'item',
          url: 'admin/security/rol'
        },
        {
          id: 'user-2',
          title: 'Usuarios',
          type: 'item',
          url: 'admin/security/user'
        },
        {
          id: 'module-2',
          title: 'Módulos',
          type: 'item',
          url: 'admin/security/module'
        }
      ]
     }
        
      ]
    }
]

