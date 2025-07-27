import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardViewRolComponent } from './card-view-rol.component';

describe('CardViewRolComponent', () => {
  let component: CardViewRolComponent;
  let fixture: ComponentFixture<CardViewRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardViewRolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardViewRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
