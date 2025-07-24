import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-staff-card',
  standalone:false,
  templateUrl: './staff-card.component.html',
  styleUrls: ['./staff-card.component.css']
})
export class StaffCardComponent {
  @Input() name: string = 'Jorge Enrique Bayter';
  @Input() profession: string = 'Cirujano';
  @Input() imageUrl: string = '';
  @Input() backgroundColor: string = '#a8e6cf';
  @Input() logoUrl: string = '';
  @Input() width: string = '280px';
  @Input() height: string = '400px';
}