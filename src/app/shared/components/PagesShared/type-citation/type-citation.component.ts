import { ChangeDetectionStrategy, Component, Input } from '@angular/core';


export interface TypeCitation {
  id: number;
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
export class TypeCitationComponent {

   @Input()  typeCitations: TypeCitation[] = []

    // 🧠 Convierte "Consulta externa" -> "/consulta-externa"
  toRoute(name: string): string {
    return '/' + name
      .normalize('NFD')                 // separa acentos
      .replace(/[\u0300-\u036f]/g, '') // elimina acentos
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')            // espacios -> guiones
      .replace(/[^a-z0-9\-]/g, '');    // limpia caracteres raros
  }
 trackById = (_: number, item: TypeCitation) => item.id;

}
