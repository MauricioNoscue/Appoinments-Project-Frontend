import { Component, OnInit } from '@angular/core';
import { TypeCitation } from '../../../../shared/components/PagesShared/type-citation/type-citation.component';
import { TypeCitationService } from '../../../../shared/services/Hospital/type-citation.service';

@Component({
  selector: 'app-reservation',
  standalone:false,
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent  implements OnInit{


  
  
    typeCitation : TypeCitation[] = []
  
  
    constructor(private service: TypeCitationService) { }
  
  
   ngOnInit(): void {
  this.service.traerTodo().subscribe(data => {
    // nos quedamos solo con las que tienen horarios
    this.typeCitation = data.filter(tc => tc.hasShedule === true);
  });
}

}
