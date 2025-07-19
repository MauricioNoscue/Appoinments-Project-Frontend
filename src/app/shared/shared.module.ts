import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module'; // <-- importante
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { IconIncioComponent } from './components/icons/icon-incio/icon-incio.component';
import { NavLinkComponent } from './components/NavLinks/nav-link/nav-link.component';
import { ButtonBasicComponent } from './components/button/button-basic/button-basic.component';


const sharedComponents =[
  MobileMenuComponent,
  IconIncioComponent,
  NavLinkComponent,
  ButtonBasicComponent

]




@NgModule({
  declarations: [sharedComponents],
  imports: [
    CommonModule,
    MaterialModule 
  ],
  exports: [
   sharedComponents
  ]
})
export class SharedModule {}
