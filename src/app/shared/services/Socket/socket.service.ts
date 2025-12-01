import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Horario, SlotLockedEvent, SlotUnlockedEvent, SlotBookedEvent, SlotLockResponse, SlotLockRequest, SlotUnlockResponse, SlotUnlockRequest, SlotKey } from '../../Models/socket/models.socket';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

 private hubUrl = environment.apiURL + environment.hubs.appointments;
  private connection?: signalR.HubConnection;

  private scheduleHourId!: number;
  private dateISO!: string; // "YYYY-MM-DD"

  private blocksMap = new Map<string, Horario>();   // key = "HH:mm:ss"
  private blocks$ = new BehaviorSubject<Horario[]>([]);
  readonly blocksChanges$: Observable<Horario[]> = this.blocks$.asObservable();

  constructor(private zone: NgZone) {}

  private getToken(): string {
    return localStorage.getItem('jwt') || ''; // tu clave actual de token
  }

  async connect(): Promise<void> {
    if (this.connection) return;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, { accessTokenFactory: () => this.getToken() })
      .withAutomaticReconnect()
      .build();

    this.connection.on('SlotLocked',  (evt: SlotLockedEvent)  => this.zone.run(() => this.applyLocked(evt)));
    this.connection.on('SlotUnlocked',(evt: SlotUnlockedEvent)=> this.zone.run(() => this.applyUnlocked(evt)));
    this.connection.on('SlotBooked',  (evt: SlotBookedEvent)  => this.zone.run(() => this.applyBooked(evt)));

    await this.connection.start();
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = undefined;
    }
  }

  /** Entrar al grupo de un día concreto */
  async joinDay(scheduleHourId: number, dateYMD: string): Promise<void> {
    this.scheduleHourId = scheduleHourId;
    this.dateISO = dateYMD;
    await this.connect();
    await this.connection!.invoke('JoinDay', scheduleHourId, new Date(dateYMD));
  }

  async leaveDay(): Promise<void> {
    if (!this.connection || !this.scheduleHourId || !this.dateISO) return;
    await this.connection.invoke('LeaveDay', this.scheduleHourId, new Date(this.dateISO));
  }

  /** Set inicial de bloques (REST) */
  setBlocks(list: Horario[]): void {
    this.blocksMap.clear();
    for (const h of list) this.blocksMap.set(h.hora, { ...h });
    this.emitBlocks();
  }

// Cambia estos métodos:
lock(time: string): Promise<SlotLockResponse> {
  const req: SlotLockRequest = { scheduleHourId: this.scheduleHourId, date: this.dateISO, timeBlock: time };
  return this.connection!.invoke<SlotLockResponse>('LockSlot', req); // ← Quita el ", null"
}

unlock(time: string): Promise<SlotUnlockResponse> {
  const req: SlotUnlockRequest = { scheduleHourId: this.scheduleHourId, date: this.dateISO, timeBlock: time };
  return this.connection!.invoke<SlotUnlockResponse>('UnlockSlot', req); // ← Quita el ", null"
}

confirm(time: string,relatedPersonId?: number): Promise<{ success: boolean; citationId?: number; reason?: string }> {
  const slot: SlotKey = { scheduleHourId: this.scheduleHourId, date: this.dateISO, timeBlock: time };
  return this.connection!.invoke<{ success: boolean; citationId?: number; reason?: string }>('ConfirmSlot', slot, relatedPersonId ?? null); // ← Quita el ", null"
}

  // --- handlers de eventos ---
  private applyLocked(evt: SlotLockedEvent) {
    if (!this.matchContext(evt.slot)) return;
    const it = this.blocksMap.get(evt.slot.timeBlock);
    if (!it) return;
    this.blocksMap.set(evt.slot.timeBlock, {
      ...it,
      estaDisponible: false,
      lockedBy: evt.lockOwnerUserId,
      lockedUntil: evt.lockedUntil
    });
    this.emitBlocks();
  }

  private applyUnlocked(evt: SlotUnlockedEvent) {
    if (!this.matchContext(evt.slot)) return;
    const it = this.blocksMap.get(evt.slot.timeBlock);
    if (!it) return;
    this.blocksMap.set(evt.slot.timeBlock, {
      ...it,
      estaDisponible: !it.bookedCitationId, // solo si no quedó booked
      lockedBy: null,
      lockedUntil: null
    });
    this.emitBlocks();
  }

  private applyBooked(evt: SlotBookedEvent) {
    if (!this.matchContext(evt.slot)) return;
    const it = this.blocksMap.get(evt.slot.timeBlock);
    if (!it) return;
    this.blocksMap.set(evt.slot.timeBlock, {
      ...it,
      estaDisponible: false,
      bookedCitationId: evt.citationId
    });
    this.emitBlocks();
  }

  private matchContext(slot: SlotKey): boolean {
    return slot.scheduleHourId === this.scheduleHourId
        && slot.date.slice(0, 10) === this.dateISO.slice(0, 10);
  }

  private emitBlocks() {
    this.blocks$.next(
      Array.from(this.blocksMap.values()).sort((a, b) => a.hora.localeCompare(b.hora))
    );
  }
}
