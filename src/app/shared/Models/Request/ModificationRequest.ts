// Modelo base compartido por todas las entidades
export interface BaseModel {
  /** Identificador único */
  id: number;

  /** Eliminado lógico */
  isDeleted: boolean;

  /** Fecha de registro */
  registrationDate?: Date | null;
}

// Tipos de solicitud (debe coincidir con C#)
export enum TypeRequest {
  AccountUnlock = 0, // Desbloqueo de cuenta
  Absence = 1,       // Falta
  Other = 2          // Otro
}

// DTO para crear solicitud de modificación
export interface ModificationRequestCreateDto {
  /** Razón de la solicitud */
  reason: string;

  /** Tipo de solicitud */
  typeRequest: TypeRequest;

  /** Id del usuario que genera la solicitud */
  userId: number;

  /** Fecha inicial */
  startDate?: Date | null;

  /** Fecha final */
  endDate?: Date | null;

  /** Id del estado asociado */
  statusTypesId: number;

  /** Observación opcional */
  observation?: string | null;
}

// DTO para editar solicitud de modificación
export interface ModificationRequestEditDto {
  /** Identificador de la solicitud */
  id: number;

  /** Razón de la solicitud */
  reason: string;

  /** Tipo de solicitud */
  typeRequest: TypeRequest;

  /** Fecha inicial */
  startDate?: Date | null;

  /** Fecha final */
  endDate?: Date | null;

  /** Id del estado */
  statusTypesId: number;

  /** Observación opcional */
  observation?: string | null;
}


// DTO para listar solicitudes de modificación
export interface ModificationRequestListDto extends BaseModel {
  /** Razón de la solicitud */
  reason: string;

  /** Tipo de solicitud */
  typeRequest: TypeRequest;

  /** Usuario que hizo la solicitud */
  userId: number;
  
  userName: string;        // ✔ nuevo

  /** Nombre del tipo de documento */
    document: string;        // ✔ nuevo

  /** Nombre del estado */
  statusTypeName: string;

  /** Id del estado */
  statustypesId: number;

  /** Fecha de inicio */
  startDate?: Date | null;

  /** Fecha final */
  endDate?: Date | null;

  /** Observación opcional */
  observation?: string | null;
}
