import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreCitationService } from '../../../services/Hospital/core-citation.service';
import { Subscription } from 'rxjs';
import { SocketService } from '../../../services/Socket/socket.service';
import { Horario } from '../../../Models/socket/models.socket';
import Swal from 'sweetalert2';
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

  especialidad = 'Medicina General';
  nombreDoctor = 'Dr. Ortis Acosta Jhoyner Duvan';

  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: CoreCitationService,
    private realtime: SocketService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idTypeCitation = idParam ? +idParam : 0;
  }

  ngOnDestroy(): void {
    this.realtime.leaveDay();
    this.subs.forEach(s => s.unsubscribe());
  }

  async onDateChange(date: string) {
    this.selectedDate = date;

    this.service.getAvailableBlocks(this.idTypeCitation, date, true)
      .subscribe(async (list) => {
        // asignar directamente
        this.blocks = list;
        this.separarHorarios();

        // set a realtime store
        this.realtime.setBlocks(list);

        await this.realtime.joinDay(this.scheduleHourId, date);

        this.subs.push(
          this.realtime.blocksChanges$.subscribe(b => {
            this.blocks = b;
            this.separarHorarios();
          })
        );
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
      await Swal.fire({
        icon: 'error',
        title: 'Horario ocupado',
        text: `Ya está en uso (hasta ${lock.lockedUntil}).`,
        confirmButtonText: 'Entendido'
      });
      return;
    }

    const confirmar = await Swal.fire({
      title: '¿Confirmar cita?',
      text: `¿Quieres agendar ${this.formatearHora(h.hora)}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agendar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmar.isConfirmed) {
      await this.realtime.unlock(h.hora);
      return;
    }

    const res = await this.realtime.confirm(h.hora);
    if (res.success) {
      await Swal.fire({
        icon: 'success',
        title: '¡Agendado!',
        text: 'Tu cita ha sido registrada correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo agendar',
        text: res.reason || 'Intenta nuevamente.',
        confirmButtonText: 'Ok'
      });
    }
  } catch (e) {
    console.error(e);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error de red o autenticación.',
      confirmButtonText: 'Ok'
    });
  }
}
}
