import { MenuItem } from "../../../shared/Models/ManuItemModel";



export const menuAdmin: MenuItem[] = [

     {
      id: 'navigation',
      title: 'Inicio',
      type: 'group',
      children: [
        {
          id: 'dashboard',
          title: 'Incio',
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

