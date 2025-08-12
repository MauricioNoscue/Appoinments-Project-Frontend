import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-card',
  templateUrl: './section-card.component.html',
  styleUrl: './section-card.component.css',
  standalone:false
})
export class SectionCardComponent {

  @Input()icono!:string;
  @Input()tittle!:string;
  @Input()Value!:string;
}
