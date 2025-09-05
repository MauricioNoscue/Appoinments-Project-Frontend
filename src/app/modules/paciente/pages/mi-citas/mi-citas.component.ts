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

  // datos
  citas = signal<CitationList[]>([]);
  cargando = signal<boolean>(true);

  // mapeo de tabs -> estados (ajústalo a tus valores reales)
  private stateMap: Record<TabKey, string[]> = {
    programadas: ['Pendiente', 'Programada'],
    canceladas: ['Cancelada'],
    asistidas: ['Completada', 'Asistida'],
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
}
