import { Component, EventEmitter, input, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
 standalone:false,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent<T> {
  @Input() title = 'Título';
  @Input() addLabel?: string;
  @Input() addSubtitle?: string;
  @Input() showAddButton = true;
  @Input() showSearch = true;

  // 🔹 Lista original que viene del padre
  @Input() data: T[] = [];

  // 🔹 Campos a buscar dentro de cada elemento
  @Input() searchFields: (keyof T)[] = [];

  // 🔹 Emitirá la lista filtrada automáticamente
  @Output() filteredData = new EventEmitter<T[]>();

  @Output() onAdd = new EventEmitter<void>();

  searchTerm = '';

  // 🔍 Filtra y emite resultados automáticamente
  onSearchChange(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredData.emit(this.data);
      return;
    }

    const filtered = this.data.filter((item) =>
      this.searchFields.some((field) => {
        const value = (item[field] ?? '').toString().toLowerCase();
        return value.includes(term);
      })
    );

    this.filteredData.emit(filtered);
  }
}