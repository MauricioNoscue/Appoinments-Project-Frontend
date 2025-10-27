import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  FormC,
  FormList,
} from '../../../../../shared/Models/security/FormModel';
import { FormService } from '../../../../../shared/services/form.service';
import { FormFormComponent } from '../../../Components/forms/FormsBase/form-form/form-form.component';
import Swal from 'sweetalert2';
import { ColumnDefinition } from '../../../../../shared/Models/Tables/TableModels';
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
  dataSourceFiltered: FormList[] = [];
  searchTerm = '';

  columnDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'text' },
    { key: 'name', label: 'Nombre' },
    { key: 'url', label: 'URL' },
    { key: 'description', label: 'Descripción' },
    {
      key: 'status',
      label: 'Estado',
      type: 'chip',
      colorFn: (x) => (x.status ? 'warn' : 'primary'),
      format: (x) => (x.status ? 'Inactivo' : 'Activo'),
    },
    { key: 'detail', label: 'Detalle', type: 'icon', icon: 'info', tooltip: 'Ver detalle' },
    { key: 'actions', label: 'Acciones', type: 'actions' },
  ];

  displayedColumns: string[] = this.columnDefs.map((c) => c.key);

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
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el formulario permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(id).subscribe({
          next: () => {
            this.recargarListado();
            Swal.fire('Eliminado', 'Formulario eliminado correctamente.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el formulario.', 'error');
          },
        });
      }
    });
  }

  recargarListado(): void {
    this.service.traerTodo().subscribe({
      next: (formularios) => 
        {
          this.dataSource = formularios;
          this.dataSourceFiltered = [...this.dataSource];
        },
      error: (err) => console.error('Error al cargar formularios:', err),
    });
  }

  abrirFormulario(modo: 'create' | 'edit', data?: FormC): void {
    this.dialog
      .open(FormFormComponent, {
        width: '600px',
        data: { modo, data },
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
        if (modo === 'create') {
          this.service.crear(result).subscribe(() => this.recargarListado());
        } else {
          this.service.actualizar(result).subscribe(() => this.recargarListado());
        }
      });
  }

  handleAction(e: { action: string; element: any }) {
    const { action, element } = e;
    if (action === 'delete') this.eliminar(element.id);
    if (action === 'edit') this.abrirFormulario('edit', element);
    if (action === 'detail') Swal.fire('Detalle', `Formulario: ${element.name}`, 'info');
  }
}
