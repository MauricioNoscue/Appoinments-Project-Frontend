import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-button-basic',
  standalone:false,
  templateUrl: './button-basic.component.html',
  styleUrl: './button-basic.component.css'
})
export class ButtonBasicComponent {

  @Input() text : string = "Texto"
}
