import { BaseModel } from "../Request/ModificationRequest";

// Modelo para crear una reseña del doctor
export interface DoctorReviewCreateDto {
  doctorId: number;     // ID del doctor
  userId: number;       // ID del usuario que reseña
  rating: number;       // Calificación (1–5)
  citationId?: number;  // Cita asociada (opcional)
  comment?: string;     // Comentario opcional
}


// Modelo para editar una reseña del doctor
export interface DoctorReviewEditDto {
  id: number;           // ID de la reseña
  rating: number;       // Calificación (1–5)
  citationId?: number;  // Cita asociada (opcional)
  comment?: string;     // Comentario opcional
}

// Modelo usado para listar reseñas del doctor
export interface DoctorReviewListDto extends BaseModel {
  doctorId: number;     // ID del doctor
  userId: number;       // ID del usuario que reseña
  rating: number;       // Calificación (1–5)
  comment?: string;     // Comentario opcional
  citationId?: number;  // Cita asociada (opcional)

  doctorName: string;   // Nombre del doctor
  userName: string;     // Nombre del usuario
}


export interface DoctorReviewAll {
  // Datos del doctor ----------------------------
  id: number;                    // Id del doctor
  active: boolean;               // Estado activo/inactivo
  emailDoctor?: string | null;   // Email del doctor
  image: string;                 // Imagen del doctor (base64 o URL)

  // Datos de la especialidad ---------------------
  specialtyId: number;           // Id de la especialidad
  specialtyName: string;         // Nombre de la especialidad
  specialtyDescription: string;  // Descripción de la especialidad
  averageRating: number;            // Calificación promedio
totalReviews: number;             // Total de reseñas
ratingsDistribution: { [key: number]: number }; // Cantidad por estrella


  // Datos básicos de la persona ------------------
  personId: number;              // Id de la persona
  fullName: string;              // Nombre completo
  fullLastName: string;          // Apellidos
  document: string;              // Número de documento
  phoneNumber: string;           // Teléfono
  dateBorn: string;              // Fecha de nacimiento (ISO-string)
  address?: string | null;       // Dirección

  // Reseñas --------------------------------------
  reviews: DoctorReviewListDto[]; // Lista de reseñas del doctor
}