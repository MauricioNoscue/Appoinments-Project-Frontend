import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SignalRNotificationService {
  private hubConnection!: signalR.HubConnection;

  private _messages$ = new BehaviorSubject<any | null>(null);
  public messages$ = this._messages$.asObservable();

  constructor(private zone: NgZone) {}

  startConnection(token: string): void {
    const hubUrl = `${environment.apiURL}${environment.hubs.notification}`;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    console.log("🟦 Registrando listener ReceiveNotification…");

    this.hubConnection.on('ReceiveNotification', (data) => {
      console.log("📨 EVENTO DETECTADO EN ANGULAR ===>", data);
      this.zone.run(() => this._messages$.next(data));
    });


    this.hubConnection.onclose(err => {
      console.error("🚨 Socket CERRADO:", err);
    });


    this.hubConnection
      .start()
      .then(() => console.log("🔌 NotificationHub conectado"))
      .catch(err => console.error("❌ Error conectando NotificationHub:", err));
  }

  stopConnection(): void {
    this.hubConnection?.stop();
  }
}
