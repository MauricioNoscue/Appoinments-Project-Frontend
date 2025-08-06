import { Component, OnInit } from '@angular/core';
import { BranchList } from '../../../../shared/Models/parameter/Branch';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BranchService } from '../../../../shared/services/branch.service'; // Ajusta esta ruta
import { DialogContainerComponent } from '../../../../shared/components/Modal/dialog-container/dialog-container.component';

@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css',
})
export class BranchComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private BranchService: BranchService
  ) {}

  dataSource: BranchList[] = [];
  displayedColumns: string[] = [
    'index',
    'name',
    'departament',
    'email',
    'phoneNumber',
    'address',
    'institutionName',
    'registrationDate',
    'status',
    'detail',
    'actions',
  ];
  searchTerm: string = '';

  ngOnInit(): void {
    this.cargarSucursales();
    console.log('¿Data cargada?', this.dataSource); // <- esto NO funcionará por ser async
  }

  cargarSucursales(): void {
    this.BranchService.traerTodo().subscribe({
      next: (branches: BranchList[]) => {
        this.dataSource = branches;
        console.log('Sucursales cargadas:', branches);
      },
      error: (err) => {
        console.error('Error al cargar sucursales:', err);
      },
    });
  }

  get filteredDataSource(): BranchList[] {
    return this.dataSource.filter(
      (item) =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.institutionName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
    );
  }

  eliminar(id: number): void {
    const confirmado = confirm('¿Estás seguro de eliminar esta sucursal?');

    if (confirmado) {
      this.BranchService.eliminar(id).subscribe({
        next: () => {
          console.log('Sucursal eliminada exitosamente');
          this.cargarSucursales();
        },
        error: (err) => console.error('Error al eliminar:', err),
      });
    }
  }

  recargarListado(): void {
    this.cargarSucursales();
  }

  abrirFormulario(modo: 'create' | 'edit', data?: BranchList): void {
    console.log('Abrir formulario en modo:', modo, 'con datos:', data);

    import(
      '../../Components/forms/FormsBase/form-branch/form-branch.component'
    ).then(({ FormBranchComponent }) => {
      const dialogRef = this.dialog.open(DialogContainerComponent, {
        width: '600px',
        data: {
          component: FormBranchComponent,
          payload: { modo, data },
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (modo === 'create') {
            this.BranchService.crear(result).subscribe(() =>
              this.cargarSucursales()
            );
          } else {
            this.BranchService.actualizar(result).subscribe(() =>
              this.cargarSucursales()
            );
          }
        }
      });
    });
  }
}
