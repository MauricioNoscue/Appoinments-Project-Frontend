import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TypeCitationModalComponent } from './type-citation-modal/type-citation-modal.component';


export interface TypeCitation {
  id: number;
  name: string;
  description: string;
  icon: string;
  hasShedule: boolean;
}

 export interface TypeCitationCreateDto{
      name: string;
      description: string;
      icon: string;
 }



@Component({
  selector: 'app-type-citation',
  standalone: false,
  templateUrl: './type-citation.component.html',
  styleUrl: './type-citation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeCitationComponent implements OnChanges {

  
constructor(private dialog: MatDialog) {}

   @Input()  typeCitations: TypeCitation[] = []
   typeCitationsFiltered: TypeCitation[] = []

   ngOnChanges(): void {
    this.typeCitationsFiltered = [...this.typeCitations];
  }

  toRoute(name: string): string {
    return '/' + name
      .normalize('NFD')               
      .replace(/[\u0300-\u036f]/g, '') 
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')          
      .replace(/[^a-z0-9\-]/g, '');  
  }
 trackById = (_: number, item: TypeCitation) => item.id;

pageIndex = 0;
pageSize = 12;

onPageChange(event: PageEvent): void {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;


}


crear(): void {
  const ref = this.dialog.open(TypeCitationModalComponent, {
    width: '450px',
    disableClose: true
  });

  // 👉 Si quieres refrescar después de crear:
  ref.afterClosed().subscribe(created => {
    if (created) {
      // recargar tipos de cita si quieres
      console.log('SE CREÓ, RECARGA LISTA');
    }
  });
}
}
