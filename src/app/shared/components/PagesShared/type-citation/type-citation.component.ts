import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';


export interface TypeCitation {
  id: number;
  name: string;
  description: string;
  icon: string;
  hasShedule: boolean;
}


@Component({
  selector: 'app-type-citation',
  standalone: false,
  templateUrl: './type-citation.component.html',
  styleUrl: './type-citation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeCitationComponent implements OnChanges {

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
  alert('Crear nuevo tipo de cita');
}
}
