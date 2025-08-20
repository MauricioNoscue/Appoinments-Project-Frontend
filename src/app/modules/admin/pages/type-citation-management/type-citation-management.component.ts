import { TypeCitationService } from './../../../../shared/services/Hospital/type-citation.service';
import { Component, OnInit } from '@angular/core';
import { TypeCitation } from '../../../../shared/components/PagesShared/type-citation/type-citation.component';

@Component({
  selector: 'app-type-citation-management',
  standalone: false,
  templateUrl: './type-citation-management.component.html',
  styleUrl: './type-citation-management.component.css'
})
export class TypeCitationManagementComponent implements  OnInit{


  typeCitation : TypeCitation[] = []


  constructor(private service: TypeCitationService) { }


  ngOnInit(): void {
   this.service.traerTodo().subscribe(data =>{
    this.typeCitation = data;
   })
  }


}
