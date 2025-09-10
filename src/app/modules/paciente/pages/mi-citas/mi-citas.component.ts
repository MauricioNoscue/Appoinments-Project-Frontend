import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitationService } from '../../../../shared/services/citation.service';
import { CitationList } from '../../../../shared/Models/hospital/CitationModel';

type TabKey = 'programadas' | 'canceladas' | 'asistidas';

@Component({
  selector: 'app-mi-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mi-citas.component.html',
  styleUrl: './mi-citas.component.css',
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
      error: () => this.cargando.set(false),
    });
  }

  setTab(t: TabKey) {
    this.tab.set(t);
  }
  // ⬇️ NUEVO: método para cancelar
  cancelar(c: CitationList) {
    if (c.state !== 'Programada') return;

    const ok = confirm(
      `¿Cancelar la cita del ${new Date(
        c.appointmentDate
      ).toLocaleDateString()} ${c.timeBlock ?? ''} con ${c.nameDoctor}?`
    );
    if (!ok) return;

    const set = new Set(this.cancelandoIds());
    set.add(c.id);
    this.cancelandoIds.set(set);

    this.citaSrv
      .actualizar({ id: c.id, state: 'Cancelada', note: c.note } as any)
      .subscribe({
        next: () => {
          // cambia el estado localmente
          const arr = this.citas().map((x) =>
            x.id === c.id ? { ...x, state: 'Cancelada' } : x
          );
          this.citas.set(arr);

          const s2 = new Set(this.cancelandoIds());
          s2.delete(c.id);
          this.cancelandoIds.set(s2);
        },
        error: () => {
          const s2 = new Set(this.cancelandoIds());
          s2.delete(c.id);
          this.cancelandoIds.set(s2);
          alert('No se pudo cancelar la cita. Intenta de nuevo.');
        },
      });
  }
}
