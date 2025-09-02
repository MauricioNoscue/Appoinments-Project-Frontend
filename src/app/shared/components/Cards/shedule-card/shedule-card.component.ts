import { Component, Input } from '@angular/core';
import { shedule } from '../../../Models/hospital/shedule';

@Component({
  selector: 'app-shedule-card',
standalone:false,
  templateUrl: './shedule-card.component.html',
  styleUrl: './shedule-card.component.css'
})
export class SheduleCardComponent {
 @Input() schedule!: shedule;
}
