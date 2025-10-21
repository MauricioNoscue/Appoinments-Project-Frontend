import { Component, EventEmitter, input, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
 standalone:false,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  @Input() title = 'Título';              // Texto principal
  @Input() addLabel?: string;             // Línea superior del botón
  @Input() addSubtitle?: string;          // Línea inferior del botón
  @Input() showAddButton = true;          // Mostrar/ocultar botón
  @Input() showSearch = true;             // Mostrar/ocultar buscador

  @Output() onAdd = new EventEmitter<void>();        // Evento al hacer click en “Agregar”
  @Output() onSearch = new EventEmitter<string>();   // Evento al buscar texto

  searchTerm = '';

}
