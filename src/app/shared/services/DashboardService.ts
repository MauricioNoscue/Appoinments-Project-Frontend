import { Injectable } from "@angular/core";
import { shareReplay, Observable, BehaviorSubject } from "rxjs";
import { DashboardDto } from "../Models/dashboard/dashboard.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth/auth.service";
import { environment } from "../../../environments/environment.development";

@Injectable({ providedIn: 'root' })
export class DashboardFacadeService {
    private dashboardData$ = new BehaviorSubject<DashboardDto | null>(null);
    readonly dashboard$: Observable<DashboardDto | null> = this.dashboardData$.asObservable();

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}

    loadDashboardData(): void {
        console.log('Loading dashboard data...');
        const token = this.authService.getToken();
        if (!token) {
            console.error('No token available');
            this.dashboardData$.next(null);
            return;
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        const url = `${environment.apiURL}/api/dashboard/data`;
        console.log('Dashboard URL:', url);

        this.http.get<DashboardDto>(url, { headers })
            .subscribe({
                next: (data) => {
                    console.log('Dashboard data loaded successfully:', data);
                    this.dashboardData$.next(data);
                },
                error: (error) => {
                    console.error('Error loading dashboard data:', error);
                    this.dashboardData$.next(null);
                }
            });
    }

    refreshData(): void {
        this.loadDashboardData();
    }
}