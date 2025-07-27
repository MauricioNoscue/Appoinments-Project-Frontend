import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DialogContainerComponent } from "../../../../../shared/components/Modal/dialog-container/dialog-container.component";
import { FormC, FormList } from "../../../../../shared/Models/security/FormModel";
import { FormService } from "../../../../../shared/services/form.service";
import { CardViewRolComponent } from "../../../Components/cards/card-view-rol/card-view-rol.component";
import { FormFormComponent } from "../../../Components/forms/FormsBase/form-form/form-form.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit {
  constructor(private service: FormService, private dialog: MatDialog) { }

  dataSource: FormList[] = [];
  displayedColumns: string[] = ['index', 'name', 'url', 'description', 'status', 'detail', 'actions'];
  searchTerm: string = '';

  ngOnInit(): void {
    this.service.traerTodo().subscribe(formularios => {
      this.dataSource = formularios;
    });
  }

  get filteredDataSource(): FormList[] {
    return this.dataSource.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  eliminar(id: number) {
    console.log('Formulario a eliminar:', id);
  }
  recargarListado(): void {
    this.service.traerTodo().subscribe({
      next: (formularios: FormList[]) => {
        this.dataSource = formularios;
      },
      error: (err) => {
        console.error('Error al cargar formularios:', err);
      }
    });
  }


  abrirFormulario(modo: 'create' | 'edit', data?: FormC): void {
    const dialogRef = this.dialog.open(DialogContainerComponent, {
      width: '600px',
      data: {
        component: FormFormComponent,
        payload: data
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (modo === 'create') {
          this.service.crear(result).subscribe(() => this.recargarListado());
        } else {
          this.service.actualizar(result).subscribe(() => this.recargarListado());
        }
      }
    });
  }


}
