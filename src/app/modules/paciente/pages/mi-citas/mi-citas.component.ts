import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { CitationService } from '../../../../shared/services/citation.service';
import { CitationList } from '../../../../shared/Models/hospital/CitationModel';

type TabKey = 'programadas' | 'canceladas' | 'asistidas';

@Component({
  selector: 'app-mi-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mi-citas.component.html',
  styleUrls: ['./mi-citas.component.css'], // corregido
})
export class MiCitasComponent implements OnInit {
  private citaSrv = inject(CitationService);

  // estado UI
  tab = signal<TabKey>('programadas');
  q = signal<string>('');
  cancelandoIds = signal<Set<number>>(new Set<number>());

  // datos
  citas = signal<CitationList[]>([]);
  cargando = signal<boolean>(true);

  // mapeo de tabs -> estados (ajústalo a tus valores reales)
  private stateMap: Record<TabKey, string[]> = {
    programadas: ['Programada'],
    canceladas: ['Cancelada'],
    asistidas: ['Asistida'],
  };

  filtered = computed(() => {
    const t = this.tab();
    const term = this.q().trim().toLowerCase();
    const estados = this.stateMap[t] ?? [];
    return this.citas()
      .filter((c) => estados.length === 0 || estados.includes(c.state))
      .filter(
        (c) =>
          !term ||
          c.nameDoctor?.toLowerCase().includes(term) ||
          c.consultingRoomName?.toLowerCase().includes(term) ||
          c.state?.toLowerCase().includes(term)
      )
      .sort((a, b) => {
        const aDate = new Date(a.appointmentDate).getTime();
        const bDate = new Date(b.appointmentDate).getTime();
        if (aDate !== bDate) return aDate - bDate;
        const aTB = a.timeBlock ?? '';
        const bTB = b.timeBlock ?? '';
        return aTB.localeCompare(bTB);
      });
  });

  ngOnInit(): void {
    this.citaSrv.traerListado().subscribe({
      next: (r) => {
        this.citas.set(r);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las citas.',
          confirmButtonText: 'Cerrar',
        });
      },
    });
  }

  setTab(t: TabKey) {
    this.tab.set(t);
  }

  // ⬇️ método para cancelar (con SweetAlert2 y modal de carga)
  cancelar(c: CitationList) {
    if (c.state !== 'Programada') return;

    const fechaStr = new Date(c.appointmentDate).toLocaleDateString();
    const horaStr = c.timeBlock ? ` ${c.timeBlock}` : '';

    Swal.fire({
      title: 'Confirmar cancelación',
      html: `¿Cancelar la cita del <b>${fechaStr}${horaStr}</b> con <b>${c.nameDoctor}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((choice) => {
      if (!choice.isConfirmed) return;

      // marcar como "cancelando" para bloquear UI (spinner en botón, etc.)
      const set = new Set(this.cancelandoIds());
      set.add(c.id);
      this.cancelandoIds.set(set);

      // mostrar modal de carga
      Swal.fire({
        title: 'Cancelando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      this.citaSrv
        .actualizar({ id: c.id, state: 'Cancelada', note: c.note } as any)
        .subscribe({
          next: () => {
            // actualizar estado local
            const arr = this.citas().map((x) =>
              x.id === c.id ? { ...x, state: 'Cancelada' } : x
            );
            this.citas.set(arr);

            // quitar del set de cancelando
            const s2 = new Set(this.cancelandoIds());
            s2.delete(c.id);
            this.cancelandoIds.set(s2);

            Swal.close(); // cerrar loading
            Swal.fire({
              icon: 'success',
              title: 'Cancelada',
              text: 'La cita fue cancelada correctamente.',
              confirmButtonText: 'OK',
            });
          },
          error: () => {
            // quitar del set de cancelando
            const s2 = new Set(this.cancelandoIds());
            s2.delete(c.id);
            this.cancelandoIds.set(s2);

            Swal.close(); // cerrar loading
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo cancelar la cita. Intenta de nuevo.',
              confirmButtonText: 'Cerrar',
            });
          },
        });
    });
  }
}
