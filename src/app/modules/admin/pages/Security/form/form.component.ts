import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  FormC,
  FormList,
} from '../../../../../shared/Models/security/FormModel';
import { FormService } from '../../../../../shared/services/form.service';
import { FormFormComponent } from '../../../Components/forms/FormsBase/form-form/form-form.component';

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FormComponent implements OnInit {
  constructor(private service: FormService, private dialog: MatDialog) {}

  dataSource: FormList[] = [];
  displayedColumns: string[] = [
    'index',
    'name',
    'url',
    'description',
    'status',
    'detail',
    'actions',
  ];
  searchTerm = '';

  ngOnInit(): void {
    this.recargarListado();
  }

  get filteredDataSource(): FormList[] {
    const q = this.searchTerm.toLowerCase();
    return this.dataSource.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q)
    );
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este formulario?')) return;
    this.service.eliminar(id).subscribe({
      next: () => this.recargarListado(),
      error: (err) => console.error('Error al eliminar:', err),
    });
  }

  recargarListado(): void {
    this.service.traerTodo().subscribe({
      next: (formularios) => (this.dataSource = formularios),
      error: (err) => console.error('Error al cargar formularios:', err),
    });
  }

  abrirFormulario(modo: 'create' | 'edit', data?: FormC): void {
    this.dialog
      .open(FormFormComponent, {
        width: '600px',
        data: { modo, data }, // viaja por MAT_DIALOG_DATA
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
        if (modo === 'create') {
          this.service.crear(result).subscribe(() => this.recargarListado());
        } else {
          this.service
            .actualizar(result)
            .subscribe(() => this.recargarListado());
        }
      });
  }
}
