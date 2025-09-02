// --- Valores permitidos como tipos de ayuda (opcional pero útil)
export type NotificationType = 'INFO' | 'WARNING' | 'ALERT' | 'SYSTEM';

// DTO para listar notificaciones (basado en NotificationListDto del backend)
export interface NotificationList {
  id: number;
  citationId: number;
  message: string;
  stateNotification: boolean; // <-- bool, true = leído, false = no leído
  typeNotification?: NotificationType; // puede venir null/undefined
  // Campos adicionales que puede mandar tu backend:
  citation?: string;
  typeCitationName?: string;
  createdAt?: string; // formato ISO
}

// DTO para crear notificación (basado en NotificationCreateDto del backend)
export interface NotificationCreate {
  citationId: number;
  message: string;
  stateNotification?: boolean; // default en backend: false (no leído)
  typeNotification?: NotificationType; // default en backend: "INFO"
}

// DTO para editar/actualizar notificación (basado en NotificationUpdateDto del backend)
export interface NotificationEdit {
  id: number;
  citationId?: number;
  message?: string;
  stateNotification?: boolean;
  typeNotification?: NotificationType;
}

// Interface general para el componente (incluye extras del frontend)
export interface Notification {
  id?: number;
  notificationId?: number; // compat con modelos anteriores
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  citationId: number;
  message: string;
  stateNotification: boolean; // true = leído, false = no leído
  typeNotification?: NotificationType;

  // Extras de vista/compatibilidad
  citationName?: string;
  citation?: string;
  typeCitationName?: string;
  selected?: boolean; // para UI
}

// Interface extendida para el listado con extras
export interface NotificationListExtended extends NotificationList {
  notificationId?: number;
  isDeleted?: boolean;
  registrationDate?: Date;
  citationName?: string;
}

// Opción para selects/dropdowns
export interface NotificationOption {
  id: number;
  label: string; // ej: el message o un resumen
}
