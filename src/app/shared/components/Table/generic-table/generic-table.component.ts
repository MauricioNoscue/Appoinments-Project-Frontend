import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ColumnDefinition } from '../../../Models/Tables/TableModels';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-generic-table',
standalone:false,
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.css'
})
export class GenericTableComponent {
 @Input() dataSource: any[] = [];
  @Input() columns: string[] = [];
  @Input() columnDefs: ColumnDefinition[] = [];

  @Output() actionClicked = new EventEmitter<{ action: string; element: any }>();

  pageIndex = 0;
  pageSize = 10;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) this.pageIndex = 0;
  }

  get paginatedData(): any[] {
    const start = this.pageIndex * this.pageSize;
    return this.dataSource.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  emitAction(action: string, element: any): void {
    this.actionClicked.emit({ action, element });
  }

  
  getRowIndex(i: number): number {
    return this.pageIndex * this.pageSize + i + 1;
  }
}
