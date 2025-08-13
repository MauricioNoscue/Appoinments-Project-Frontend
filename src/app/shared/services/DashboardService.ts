import { Injectable } from "@angular/core";
import { shareReplay, map, combineLatest, Observable } from "rxjs";
import { DashboardStats, AppointmentStatus, ChartItem, StaffMember, STAFF_STATUS } from "../Models/dashboard/dashboard.model";
import { UserService } from "./user.service";
import { DoctorService } from "./doctor.service";
import { CitationService } from "./citation.service";

interface Citation {
    id: number;
    date: string | Date;
    status: 'scheduled' | 'completed' | 'canceled';
    createdAt?: string | Date;
    doctorId?: number;
    patientId?: number;
}

interface User { id: number; personName: string; }
interface Doctor {
    id: number,
    specialty: string,
    active: boolean,
    image: string,
    fullName: string | null,
    emailDoctor: string,
    isDeleted: boolean,
    registrationDate: Date
}

@Injectable({ providedIn: 'root' })
export class DashboardFacadeService {
    readonly users$: Observable<User[]>;
    readonly doctors$: Observable<Doctor[]>;
    readonly citations$: Observable<Citation[]>;
    readonly stats$: Observable<DashboardStats>;
    readonly appointmentStatus$: Observable<AppointmentStatus>;
    readonly yearBehavior$: Observable<ChartItem[]>;
    readonly staff$: Observable<StaffMember[]>;

    constructor(
        private usersService: UserService,
        private doctorsService: DoctorService,
        private citationsService: CitationService
    ) {
        this.users$ = this.usersService.traerTodo().pipe(shareReplay(1));

        this.doctors$ = this.doctorsService.traerTodo().pipe(shareReplay(1));

        this.citations$ = this.citationsService.traerTodo().pipe(
            map(cs => cs.map(c => ({
                ...c,
                date: new Date(c.date),
                status: c.state as 'scheduled' | 'completed' | 'canceled'
            } as Citation))),
            shareReplay(1)
        );

        this.stats$ = combineLatest([this.citations$, this.users$]).pipe(
            map(([citas, users]) => {
                const dayCount = citas.filter(c => this.isSameDay(c.date as Date)).length;
                const monthCount = citas.filter(c => this.isSameMonth(c.date as Date)).length;
                const yearCount = citas.filter(c => this.isSameYear(c.date as Date)).length;

                return {
                    totalCitasDia: dayCount,
                    totalCitasMes: monthCount,
                    totalCitasAnio: yearCount,
                    totalUsuarios: users.length,
                    variationDay: 0,
                    variationMonth: 0,
                    variationYear: 0
                };
            }),
            shareReplay(1)
        );

        this.appointmentStatus$ = this.citations$.pipe(
            map(citas => {
                const scheduled = citas.filter(c => c.status === 'scheduled').length;
                const completed = citas.filter(c => c.status === 'completed').length;
                const canceled = citas.filter(c => c.status === 'canceled').length;
                const total = scheduled + completed + canceled;
                return { total, scheduled, completed, canceled };
            }),
            shareReplay(1)
        );

        this.yearBehavior$ = this.citations$.pipe(
            map(citas => {
                const counts = new Array(12).fill(0);
                citas.forEach(c => {
                    const d = c.date as Date;
                    if (d.getFullYear() === this.today.getFullYear()) {
                        counts[d.getMonth()]++;
                    }
                });
                const total = counts.reduce((a, b) => a + b, 0) || 1;
                const palette = ['#17a2b8', '#007bff', '#6f42c1', '#e83e8c', '#fd7e14', '#ffc107', '#20c997', '#6610f2', '#28a745', '#dc3545', '#6c757d', '#343a40'];
                return counts.map((value, idx) => ({
                    label: this.monthLabels[idx],
                    value,
                    percent: Math.round((value / total) * 1000) / 10,
                    color: palette[idx % palette.length]
                }));
            }),
            shareReplay(1)
        );

        this.staff$ = this.doctors$.pipe(
            map<Doctor[], StaffMember[]>(docs =>
                docs.map((d, i): StaffMember => ({
                    id: d.id,
                    fullName: d.fullName ?? '',
                    specialty: d.specialty,
                    status: d.active === false
                        ? STAFF_STATUS.Inactivo
                        : (i % 3 === 0 ? STAFF_STATUS.Ocupado : STAFF_STATUS.Activo),
                    color: i % 2 === 0
                        ? 'linear-gradient(135deg, #ffd3a5, #fd9853)'
                        : 'linear-gradient(135deg, #fbc2eb, #a6c1ee)'
                }))
            ),
            shareReplay(1)
        );
    }

    private today = new Date();
    private isSameDay = (d: Date) =>
        d.getFullYear() === this.today.getFullYear() &&
        d.getMonth() === this.today.getMonth() &&
        d.getDate() === this.today.getDate();
    private isSameMonth = (d: Date) =>
        d.getFullYear() === this.today.getFullYear() &&
        d.getMonth() === this.today.getMonth();
    private isSameYear = (d: Date) => d.getFullYear() === this.today.getFullYear();
    private readonly monthLabels = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
}