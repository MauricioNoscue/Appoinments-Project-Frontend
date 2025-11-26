export const environment = {
   production: true,
  apiURL: (window as any)['env']?.API_BASE_URL || 'API_BASE_URL=http://localhost:5200',
  //apiURL: 'https://localhost:7186',
  //apiURL: 'http://localhost:5200',

  hubs: {
     notification: '/hubs/noti',
    appointments: '/hubs/appointments'
  }
};
