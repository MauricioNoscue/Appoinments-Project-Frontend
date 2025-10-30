export const environment = {
  production: true,
  apiURL: (window as any)['env']?.API_BASE_URL || 'http://appointments-api-staging:8080',
  hubs: {
    appointments: '/hubs/appointments'
  }
};
