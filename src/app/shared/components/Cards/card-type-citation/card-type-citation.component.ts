import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-type-citation',
  standalone: false,
  templateUrl: './card-type-citation.component.html',
  styleUrl: './card-type-citation.component.css'
})
export class CardTypeCitationComponent {
  @Input() id: number = 0;
  @Input() title: string = '';
  @Input() imageName: string = '';
  @Input() route: string = '';
  @Input() showOptions: boolean = false;

  constructor(private router: Router) {}

  onCardClick() {
    if (!this.showOptions && this.route) {
      this.router.navigate([`admin/CitationAviable/${this.id}`]);
    }
  }

  onOptionsClick(event: Event) {
    event.stopPropagation();
    console.log('Options clicked for:', this.title);
  }

  get imagePath(): string {
    return `/assets/icons/IconsTypeCitation/${this.imageName}`;
  }
}