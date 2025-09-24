// src/app/core/models/appointments.models.ts
export interface Horario {
  hora: string;             // "HH:mm:ss"
  estaDisponible: boolean;
  // runtime (UI)
  lockedBy?: string | null;
  lockedUntil?: string | null;
  bookedCitationId?: number | null;
}

export interface SlotKey {
  scheduleHourId: number;
  date: string; 
  timeBlock: string; // "HH:mm:ss"
}

export interface SlotLockRequest extends SlotKey {}
export interface SlotUnlockRequest extends SlotKey {}

export interface SlotLockResponse {
  locked: boolean;
  reason?: string | null;
  slot: SlotKey;
  lockOwnerUserId?: string | null;
  lockedUntil?: string | null;
}

export interface SlotUnlockResponse {
  unlocked: boolean;
  slot: SlotKey;
}

export interface SlotLockedEvent {
  slot: SlotKey;
  lockOwnerUserId: string;
  lockedUntil: string;
}
export interface SlotUnlockedEvent { slot: SlotKey; }
export interface SlotBookedEvent { slot: SlotKey; citationId: number; }
