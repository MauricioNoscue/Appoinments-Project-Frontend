import { MatDialog } from '@angular/material/dialog';
import { shedule } from '../../../../shared/Models/hospital/shedule';
import { GenericService } from './../../../../shared/services/base/generic.service';
import { ContainerComponent } from './../../../auth/container/container.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule',
  standalone:false,
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {

  shedules : shedule[] = [];


  constructor(
    private service: GenericService,private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.service.getgeneric("Shedule").subscribe(data=>{
      this.shedules = data;
    })
  }

   



}
