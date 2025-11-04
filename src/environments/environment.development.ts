export const environment = {
  production: false,  // Cambiar a false para desarrollo
  apiURL: 'https://localhost:7186',  // URL directa sin window['env']
  hubs: {
    appointments: '/hubs/appointments'
  }
};