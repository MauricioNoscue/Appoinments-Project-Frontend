// card-basic.component.ts
import { Component, Input } from '@angular/core';

export interface StatusTab {
  label: string;
  value: string;
  type: 'scheduled' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-card-basic',
  templateUrl: './card-basic.component.html',
  styleUrls: ['./card-basic.component.css'],
  standalone: false
})
export class CardBasicComponent {
  @Input() label: string = '';
  @Input() number: string | number = '';
  @Input() change: string = '';
  @Input() type: 'basic' | 'status' = 'basic';
  @Input() statusTabs: StatusTab[] = [];
}