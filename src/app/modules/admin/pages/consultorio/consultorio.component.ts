// consultorio.component.ts
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
import { MatDialog } from '@angular/material/dialog';

interface ConsultorioCardView {
  id: number;
  nombre: string;
  ubicacion: string;
  estado: string;
  imagen: string;

  // Para edición/creación
  branchId: number;
  name: string;
  roomNumber: number;
  floor: number;
  image?: string;

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

  // Imagen por defecto
  private readonly DEFAULT_IMG = 'assets/images/consultorio.png';

  constructor(
    private router: Router,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private consultingSrv: ConsultingRoomService,
    private branchSrv: BranchService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  private mapToView(
    x: ConsultingRoomList,
    branchesMap: Map<number, string>
  ): ConsultorioCardView {
    const imgUrl =
      x.image && x.image.trim() !== '' ? x.image : this.DEFAULT_IMG;

    return {
      id: x.id,
      nombre: x.name,
      ubicacion: `Piso ${x.floor} - Consultorio #${x.roomNumber}`,
      estado: '',
      imagen: imgUrl,

      branchId: x.branchId,
      name: x.name,
      roomNumber: x.roomNumber,
      floor: x.floor,
      image: x.image,

      branchName: branchesMap.get(x.branchId) ?? '—',
    };
  }

  private cargar() {
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
      error: () => {
        this.snack.open('Error cargando consultorios', 'Cerrar', {
          duration: 3500,
          panelClass: ['snack-error'],
        });
      },
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

  // ── CREAR ─────────────
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
        image: result.values.image,
      };

      this.consultingSrv.crear(dto).subscribe({
        next: () => {
          this.cargar();
          Swal.fire('Éxito', 'Consultorio creado con éxito', 'success');
        },
        error: () => {
          Swal.fire('Error', 'No se pudo crear el consultorio', 'error');
        },
      });
    });
  }

  // ── EDITAR ─────────────
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
          image: c.image ?? this.DEFAULT_IMG,
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
        image: result.values.image,
      };

      this.consultingSrv.actualizar(dto).subscribe({
        next: () => {
          this.cargar();
          Swal.fire('Éxito', 'Cambios guardados con éxito', 'success');
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el consultorio', 'error');
        },
      });
    });
  }

  // ── ELIMINAR con Swal ─────────────
  confirmarEliminar(c: ConsultorioCardView) {
    Swal.fire({
      title: '¿Eliminar consultorio?',
      html: `Seguro que deseas eliminar <strong>${c.nombre}</strong>?<br><small>Esta acción no se puede deshacer.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.consultingSrv.eliminar(c.id).subscribe({
          next: () => {
            this.cargar();
            Swal.fire(
              'Eliminado',
              'Consultorio eliminado con éxito',
              'success'
            );
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el consultorio', 'error');
          },
        });
      }
    });
  }

  // Para optimizar *ngFor
  trackById(_i: number, item: ConsultorioCardView) {
    return item.id;
  }
}
