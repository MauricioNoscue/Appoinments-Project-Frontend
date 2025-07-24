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
]