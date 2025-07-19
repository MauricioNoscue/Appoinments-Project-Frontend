import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nav-link',
standalone:false,
  templateUrl: './nav-link.component.html',
  styleUrl: './nav-link.component.css'
})
export class NavLinkComponent {

  @Input() Texto : string = '';
  
}
