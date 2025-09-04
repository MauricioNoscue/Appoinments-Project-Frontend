import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormConsultorioComponent } from '../../Components/forms/FormsBase/form-consultorio/form-consultorio.component';

import {
  ConsultingRoomList,
  ConsultingRoomCreate,
  ConsultingRoomUpdate,
} from '../../../../shared/Models/ConsultingRoom/ConsultingRoom';

import { ConsultingRoomService } from '../../../../shared/services/consulting-room.service';
import { BranchService } from '../../../../shared/services/branch.service';
import { BranchList } from '../../../../shared/Models/parameter/Branch';
import { forkJoin } from 'rxjs';

interface ConsultorioCardView {
  id: number;
  nombre: string;
  ubicacion: string;
  estado: string;
  imagen: string;

  // Para editar/crear
  branchId: number;
  name: string;
  roomNumber: number;
  floor: number;

  // NUEVO: nombre de la sucursal para mostrar
  branchName?: string;
}

@Component({
  selector: 'app-consultorio',
  standalone: false,
  templateUrl: './consultorio.component.html',
  styleUrls: ['./consultorio.component.css'],
})
export class ConsultorioComponent implements OnInit {
  searchTerm = '';
  consultorios: ConsultorioCardView[] = [];
  private readonly DEFAULT_IMG = '../../../../../assets/images/consultorio.png';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private consultingSrv: ConsultingRoomService,
    private branchSrv: BranchService
  ) {}

  ngOnInit(): void {
    this.cargar(); // ahora carga consultorios + sucursales y los junta
  }

  private mapToView(
    x: ConsultingRoomList,
    branchesMap: Map<number, string>
  ): ConsultorioCardView {
    return {
      id: x.id,
      nombre: x.name,
      ubicacion: `Piso ${x.floor} - Consultorio #${x.roomNumber}`,
      estado: '',
      imagen: this.DEFAULT_IMG,

      branchId: x.branchId,
      name: x.name,
      roomNumber: x.roomNumber,
      floor: x.floor,

      // ← nombre de sucursal desde el mapa
      branchName: branchesMap.get(x.branchId) ?? '—',
    };
  }

  private cargar() {
    // Traemos sucursales y consultorios al tiempo
    forkJoin({
      branches: this.branchSrv.traerTodo(),
      rooms: this.consultingSrv.traerTodo(),
    }).subscribe({
      next: ({ branches, rooms }) => {
        const branchesMap = new Map<number, string>(
          (branches as BranchList[]).map((b) => [b.id, b.name])
        );
        this.consultorios = (rooms as ConsultingRoomList[]).map((x) =>
          this.mapToView(x, branchesMap)
        );
      },
      error: (e) => console.error(e),
    });
  }

  get consultoriosFiltrados(): ConsultorioCardView[] {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return this.consultorios;
    return this.consultorios.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.ubicacion.toLowerCase().includes(q) ||
        (c.branchName ?? '').toLowerCase().includes(q)
    );
  }

  eliminarConsultorio(c: ConsultorioCardView) {
    if (!confirm(`¿Está seguro de eliminar el consultorio "${c.nombre}"?`))
      return;
    this.consultingSrv.eliminar(c.id).subscribe(() => this.cargar());
  }

  editarConsultorio(c: ConsultorioCardView) {
    const ref = this.dialog.open(FormConsultorioComponent, {
      width: '720px',
      data: {
        modo: 'editar',
        consultorio: {
          id: c.id,
          branchId: c.branchId,
          name: c.name,
          roomNumber: c.roomNumber,
          floor: c.floor,
        },
      },
      disableClose: true,
    });

    ref.afterClosed().subscribe((result) => {
      if (!result?.values) return;
      const dto: ConsultingRoomUpdate = {
        id: c.id,
        branchId: result.values.branchId,
        name: result.values.name,
        roomNumber: result.values.roomNumber,
        floor: result.values.floor,
      };
      this.consultingSrv.actualizar(dto).subscribe(() => this.cargar());
    });
  }

  abrirDialog(_tipo: 'create') {
    const ref = this.dialog.open(FormConsultorioComponent, {
      width: '720px',
      data: { modo: 'crear' },
      disableClose: true,
    });

    ref.afterClosed().subscribe((result) => {
      if (!result?.values) return;
      const dto: ConsultingRoomCreate = {
        branchId: result.values.branchId,
        name: result.values.name,
        roomNumber: result.values.roomNumber,
        floor: result.values.floor,
      };
      this.consultingSrv.crear(dto).subscribe(() => this.cargar());
    });
  }
}
