import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreCitationService } from '../../../services/Hospital/core-citation.service';
import { Subscription } from 'rxjs';
import { SocketService } from '../../../services/Socket/socket.service';
import { Horario } from '../../../Models/socket/models.socket';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth/auth.service';
import { RelatedPersonService } from '../../../services/related-person.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-reservation-view',
  standalone: false,
  templateUrl: './reservation-view.component.html',
  styleUrl: './reservation-view.component.css'
})
export class ReservationViewComponent implements OnInit, OnDestroy {
  idTypeCitation = 0;
  todos = true;

  selectedDate: string | null = null;
  scheduleHourId = 1;

  blocks: Horario[] = [];
  horariosManana: Horario[] = [];
  horariosTarde: Horario[] = [];
  vistaColumnas = false;
  esp!:string
  private auhtser = inject(AuthService);
  horarioSeleccionado!: Horario; // ← aquí la declaras

loadingBlocks = false; // ← loader para consultas pesadas

  private relSrv = inject(RelatedPersonService);

relacionados: any[] = [];
personId!: number;

@ViewChild('relacionadosModal') relacionadosModal!: TemplateRef<any>;


  especialidad ="";
  nombreDoctor = 'Dr. Ortis Acosta Jhoyner Duvan';

  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: CoreCitationService,
    private realtime: SocketService,
      private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id');
  this.idTypeCitation = idParam ? +idParam : 0;

  this.personId = this.auhtser.getPersonId() ?? 0;


  this.relSrv.getByPerson(this.personId).subscribe(list => {
    this.relacionados = list;
  });

  if(idParam == "2"){ this.especialidad = "Odontología"; }
  if(idParam == "4"){ this.especialidad = "Consulta externa"; }
}


  ngOnDestroy(): void {
    this.realtime.leaveDay();
    this.subs.forEach(s => s.unsubscribe());
  }

 async onDateChange(date: string) {
  this.selectedDate = date;
  this.loadingBlocks = true; // ⬅️ iniciar loader

  this.service.getAvailableBlocks(this.idTypeCitation, date, true)
    .subscribe(async (list) => {
      
      this.blocks = list;
      this.separarHorarios();

      this.realtime.setBlocks(list);
      await this.realtime.joinDay(this.scheduleHourId, date);

      this.subs.push(
        this.realtime.blocksChanges$.subscribe(b => {
          this.blocks = b;
          this.separarHorarios();
        })
      );

      this.loadingBlocks = false; // ⬅️ quitar loader
    },
    error => {
      console.error(error);
      this.loadingBlocks = false; // ⬅️ quitar loader
   
    });
}


  onBlocksLoaded(data: Horario[]) {
    this.blocks = data;
    this.realtime.setBlocks(data);
    this.separarHorarios();
  }

  private separarHorarios() {
    this.horariosManana = [];
    this.horariosTarde = [];

    this.blocks.forEach(h => {
      if (!h || !h.hora) return;
      const hour = parseInt(h.hora.split(':')[0], 10);
      (hour >= 6 && hour < 14 ? this.horariosManana : this.horariosTarde).push(h);
    });
  }

  formatearHora(hora: string): string {
    const [hh, mm] = hora.split(':');
    const n = parseInt(hh, 10);
    const ampm = n >= 12 ? 'PM' : 'AM';
    const h12 = n === 0 ? 12 : n > 12 ? n - 12 : n;
    return `${h12}:${mm} ${ampm}`;
  }

  toggleView() { this.vistaColumnas = !this.vistaColumnas; }

 
async seleccionarHorario(h: Horario) {
  if (!this.selectedDate || !h.estaDisponible) return;

  try {
    const lock = await this.realtime.lock(h.hora);
    if (!lock.locked) {
      await Swal.fire({ icon: 'error', title: 'Horario ocupado', text: 'Ya está en uso.' });
      return;
    }

    // preguntamos si agendar
    const confirmar = await Swal.fire({
      title: '¿Confirmar cita?',
      text: `¿Quieres agendar ${this.formatearHora(h.hora)}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmar.isConfirmed) {
      await this.realtime.unlock(h.hora);
      return;
    }

    // abrir modal de selección
    this.horarioSeleccionado = h; // guardamos el slot seleccionado
    this.dialog.open(this.relacionadosModal);

  } catch (e) {
    console.error(e);
    await Swal.fire({ icon: 'error', title: 'Error', text: 'Error de red o autenticación.' });
  }
}



async confirmarCitaParaMi() {
  this.dialog.closeAll();

  const res = await this.realtime.confirm(
    this.horarioSeleccionado.hora,
    this.personId
  );

  await this.finalizarConfirmacion(res);
}


async confirmarCitaRelacionada(relatedId: number) {
  this.dialog.closeAll();

  const res = await this.realtime.confirm(
    this.horarioSeleccionado.hora,
    relatedId
  );

  await this.finalizarConfirmacion(res);
}

private async finalizarConfirmacion(res: any) {
  if (res.success) {
    await Swal.fire({
      icon: 'success',
      title: '¡Agendado!',
      text: 'La cita se registró correctamente.',
      timer: 2000,
      showConfirmButton: false
    });
  } else {
    await Swal.fire({
      icon: 'error',
      title: 'No se pudo agendar',
      text: res.reason || 'Intenta nuevamente.'
    });
  }
}



}
