// consultorio.component.ts
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  // Imagen por defecto (ajusta el path a tu assets)
  private readonly DEFAULT_IMG = 'assets/images/consultorio.png';

  // ── Modal inline (confirmación) ──────────────────────────────
  @ViewChild('confirmTpl') confirmTpl!: TemplateRef<any>;
  private confirmRef?: MatDialogRef<any>;
  toDelete: ConsultorioCardView | null = null;
  // ─────────────────────────────────────────────────────────────

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
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

  // ── CREAR (usa el mismo FormConsultorioComponent) ───────────
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
        image: result.values.image, // ← guardamos la URL
      };

      this.consultingSrv.crear(dto).subscribe({
        next: () => {
          this.cargar();
          this.snack.open('Consultorio creado con éxito', 'OK', {
            duration: 2500,
            panelClass: ['snack-success'],
          });
        },
        error: () => {
          this.snack.open('Error al crear el consultorio', 'Cerrar', {
            duration: 3500,
            panelClass: ['snack-error'],
          });
        },
      });
    });
  }

  // ── EDITAR (usa el mismo FormConsultorioComponent) ──────────
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
          image: c.image ?? this.DEFAULT_IMG, // ← prefill imagen
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
        image: result.values.image, // ← guardamos la URL
      };

      this.consultingSrv.actualizar(dto).subscribe({
        next: () => {
          this.cargar();
          this.snack.open('Cambios guardados con éxito', 'OK', {
            duration: 2500,
            panelClass: ['snack-success'],
          });
        },
        error: () => {
          this.snack.open('Error al actualizar el consultorio', 'Cerrar', {
            duration: 3500,
            panelClass: ['snack-error'],
          });
        },
      });
    });
  }

  // ── ELIMINAR con modal inline (sin crear otro componente) ───
  confirmarEliminar(c: ConsultorioCardView) {
    this.toDelete = c;
    this.confirmRef = this.dialog.open(this.confirmTpl, {
      width: '420px',
      disableClose: true,
    });
  }

  onConfirmDelete() {
    if (!this.toDelete) return;
    const id = this.toDelete.id;

    this.consultingSrv.eliminar(id).subscribe({
      next: () => {
        this.confirmRef?.close();
        this.toDelete = null;
        this.cargar();
        this.snack.open('Consultorio eliminado', 'OK', {
          duration: 2500,
          panelClass: ['snack-success'],
        });
      },
      error: () => {
        this.confirmRef?.close();
        this.toDelete = null;
        this.snack.open('Error al eliminar el consultorio', 'Cerrar', {
          duration: 3500,
          panelClass: ['snack-error'],
        });
      },
    });
  }

  onCancelDelete() {
    this.confirmRef?.close();
    this.toDelete = null;
  }

  // Para optimizar el *ngFor
  trackById(_i: number, item: ConsultorioCardView) {
    return item.id;
  }
}
