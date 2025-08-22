import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTypeCitationComponent } from './card-type-citation.component';

describe('CardTypeCitationComponent', () => {
  let component: CardTypeCitationComponent;
  let fixture: ComponentFixture<CardTypeCitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTypeCitationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTypeCitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
