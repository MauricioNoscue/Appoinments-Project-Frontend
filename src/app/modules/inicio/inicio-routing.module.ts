import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePanelComponent } from './pages/home-panel/home-panel.component';
import { DoctorReviewComponent } from '../../shared/components/PagesShared/doctor-review/doctor-review.component';

const routes: Routes = [
  {path:'',component: HomePanelComponent},
  {path:'doctor-review/:id',component: DoctorReviewComponent}


  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }
