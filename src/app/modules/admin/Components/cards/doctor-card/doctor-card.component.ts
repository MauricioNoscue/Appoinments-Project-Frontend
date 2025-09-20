import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCard } from "@angular/material/card";
import { DoctorList } from '../../../../../shared/Models/hospital/DoctorListModel';

@Component({
  selector: 'app-doctor-card',
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.css'],
  standalone: false
})
export class DoctorCardComponent {
  @Input() image = '';
  @Input() fullName = '';
  @Input() specialtyName = '';
  @Input() email = '';
  @Input() active = false;
  @Input() doctor!: DoctorList;

  @Output() edit = new EventEmitter<DoctorList>();
  @Output() delete = new EventEmitter<DoctorList>();

  onEdit() {
    this.edit.emit(this.doctor);
  }

  onDelete() {
    this.delete.emit(this.doctor);
  }
}