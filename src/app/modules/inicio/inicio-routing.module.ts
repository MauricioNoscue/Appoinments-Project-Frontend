import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePanelComponent } from './pages/home-panel/home-panel.component';

const routes: Routes = [
  {path:'',component: HomePanelComponent}

  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }
