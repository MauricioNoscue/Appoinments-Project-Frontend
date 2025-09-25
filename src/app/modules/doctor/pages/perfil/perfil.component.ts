import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DoctorService } from '../../../../shared/services/doctor.service';
import { PersonaService } from '../../../../shared/services/persona.service';
import { DoctorList } from '../../../../shared/Models/hospital/DoctorListModel';
import { PersonList } from '../../../../shared/Models/security/userModel';
import { AuthService } from '../../../../shared/services/auth/auth.service';

type MaybeDate = string | number | Date | null | undefined;

interface DoctorPersona extends DoctorList {
  // Campos que vienen de la Persona
  personId?: number;
  document?: string;
  dateBorn?: MaybeDate;
  gender?: string;
  epsId?: number;
  epsName?: string;
  phoneNumber?: string;
}

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit, OnDestroy {
  // TODO: cuando exista autenticación por token, reemplazar por el id del token:
  // const doctorId = this.authService.getDoctorIdFromToken();
  // private readonly DOCTOR_ID = 1;
 DOCTOR_ID! : number
  loading = false;
  errorMsg = '';

  doctor?: DoctorPersona;

  // imagen lista para <img [src]>
  get doctorImg(): string {
    const img = (this.doctor?.image || '').trim();
    if (!img) return 'assets/images/doctor-placeholder.png';
    // si ya viene como dataURL la usamos; si es base64 "pura", armamos el prefijo
    return img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`;
  }

  get fullName(): string {
    return this.doctor?.fullName || '—';
  }

  get specialty(): string {
    return this.doctor?.specialtyName || '—';
  }

  get email(): string {
    return this.doctor?.emailDoctor || '—';
  }

  get phone(): string {
    return this.doctor?.phoneNumber || '—';
  }

  get document(): string {
    return this.doctor?.document || '—';
  }

  get gender(): string {
    return this.doctor?.gender || '—';
  }

  get age(): string {
    const d = this.doctor?.dateBorn ? new Date(this.doctor.dateBorn) : null;
    if (!d || Number.isNaN(+d)) return '—';
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return `${age}`;
  }

  // Datos del gráfico “Comportamiento del año”
  // (de momento base mínimo para mostrar estructura; cuando conectes citas por doctor, alimentas estos arrays)
  legendData: Array<{ label: string; value: number; percent: number }> = [];
  colors = [
    '#22c55e',
    '#0ea5e9',
    '#a78bfa',
    '#f59e0b',
    '#ef4444',
    '#14b8a6',
    '#8b5cf6',
    '#3b82f6',
    '#84cc16',
    '#eab308',
    '#fb7185',
    '#06b6d4',
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private doctorService: DoctorService,
    private personaService: PersonaService,
    private authService:AuthService
  ) // private authService: AuthService  // cuando exista token
  {}

  ngOnInit(): void {
   // console.log('🚀 Iniciando carga del perfil del doctor');
     const doctorId = this.authService.getDoctorId();
    if(doctorId){
    this.DOCTOR_ID = doctorId;
    }
    this.loadDoctor(this.DOCTOR_ID);

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDoctor(id: number): void {
    this.loading = true;
    this.errorMsg = '';

    console.log('🔍 Cargando doctor con ID:', id);

    // Obtener el doctor por ID
    this.doctorService
      .traerDoctorPorId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (doctor: DoctorList) => {
          console.log('✅ Doctor obtenido:', doctor);
          console.log('🔗 PersonId del doctor:', (doctor as any).personId);
          console.log('🔗 IdUser del doctor:', (doctor as any).idUser);

          // Si el doctor tiene personId o idUser, obtener la persona
          const personId = (doctor as any).personId ?? (doctor as any).idUser;

          if (personId) {
            console.log('🔍 Obteniendo persona con ID:', personId);
            this.loadPersonaData(doctor, personId);
          } else {
            console.log(
              '⚠️ Doctor no tiene personId ni idUser asignado, intentando buscar por nombre'
            );
            // Intentar buscar persona por nombre si no hay personId
            this.tryLoadPersonaByName(doctor);
          }
        },
        error: (err) => {
          console.error('❌ Error obteniendo doctor:', err);
          console.error('❌ Detalles del error:', err.message);
          this.loading = false;
          this.errorMsg = 'No fue posible cargar el perfil del doctor.';
        },
      });
  }

  private loadPersonaData(doctor: DoctorList, personId: number): void {
    this.personaService
      .obtenerPorId(personId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (persona: PersonList) => {
          console.log('✅ Persona obtenida:', persona);

          // Combinar datos del doctor y persona
          this.doctor = {
            ...doctor,
            personId: personId,
            document: persona.document,
            dateBorn: persona.dateBorn,
            gender: persona.gender,
            epsId: persona.epsId,
            phoneNumber: persona.phoneNumber,
          };

          console.log('🎯 Doctor combinado final:', this.doctor);
          console.log('📋 Documento:', this.doctor.document);
          console.log('📞 Teléfono:', this.doctor.phoneNumber);
          console.log('⚧ Género:', this.doctor.gender);
          console.log('🎂 Fecha nacimiento:', this.doctor.dateBorn);
          console.log('🏥 EPS ID:', this.doctor.epsId);

          this.afterLoad();
          this.loading = false;
        },
        error: (err: any) => {
          console.error('❌ Error obteniendo persona:', err);
          console.error('❌ Detalles del error:', err.message);
          this.doctor = doctor; // Mostrar doctor sin datos de persona
          this.afterLoad();
          this.loading = false;
        },
      });
  }

  private tryLoadPersonaByName(doctor: DoctorList): void {
    // Si el doctor tiene fullName, intentar buscar persona por ese nombre
    if (doctor.fullName) {
      console.log('🔍 Buscando persona por nombre:', doctor.fullName);

      // Usar el endpoint de personas para buscar por nombre (esto es un workaround)
      // Nota: Esto asume que hay un endpoint que permite buscar por nombre
      this.personaService
        .traerTodo()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (personas: PersonList[]) => {
            const persona = personas.find(
              (p) => p.fullName === doctor.fullName
            );
            if (persona) {
              console.log('✅ Persona encontrada por nombre:', persona);
              this.doctor = {
                ...doctor,
                personId: persona.id,
                document: persona.document,
                dateBorn: persona.dateBorn,
                gender: persona.gender,
                epsId: persona.epsId,
                phoneNumber: persona.phoneNumber,
              };
              console.log('🎯 Doctor combinado por nombre:', this.doctor);
            } else {
              console.log('⚠️ No se encontró persona con el nombre del doctor');
              this.doctor = doctor;
            }
            this.afterLoad();
            this.loading = false;
          },
          error: (err: any) => {
            console.error('❌ Error buscando personas:', err);
            this.doctor = doctor;
            this.afterLoad();
            this.loading = false;
          },
        });
    } else {
      console.log('⚠️ Doctor no tiene nombre para buscar persona');
      this.doctor = doctor;
      this.afterLoad();
      this.loading = false;
    }
  }

  private afterLoad(): void {
    // Alimentar la leyenda del gráfico con algo realista.
    // Si más adelante consumes las citas por doctor, reemplaza esta parte.
    const base = [
      { label: 'Ene', value: 33 },
      { label: 'Feb', value: 22 },
      { label: 'Mar', value: 12 },
      { label: 'Abr', value: 0 },
      { label: 'May', value: 0 },
      { label: 'Jun', value: 0 },
      { label: 'Jul', value: 0 },
      { label: 'Ago', value: 0 },
      { label: 'Sep', value: 0 },
      { label: 'Oct', value: 0 },
      { label: 'Nov', value: 0 },
      { label: 'Dic', value: 0 },
    ];
    const total = base.reduce((acc, x) => acc + x.value, 0) || 1;
    this.legendData = base.map((x) => ({
      label: x.label,
      value: x.value,
      percent: Math.round((x.value * 100) / total),
    }));
  }
}
