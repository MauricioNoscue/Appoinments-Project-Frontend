import { Component, Input } from '@angular/core';
import { MatCard } from "@angular/material/card";

@Component({
  selector: 'app-doctor-card',
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.css'],
  standalone: false
})
export class DoctorCardComponent {
  @Input() image = '';
  @Input() fullName = '';
  @Input() specialty = '';
  @Input() email = '';
  @Input() active = false;
}