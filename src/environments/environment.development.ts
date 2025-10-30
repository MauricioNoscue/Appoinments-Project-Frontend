export const environment = {
  production: true,
  apiURL: (window as any)['env']?.API_BASE_URL || 'API_BASE_URL=http://localhost:5100',
  hubs: {
    appointments: '/hubs/appointments'
  }
};
