import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardViewModuleComponent } from './card-view-module.component';

describe('CardViewModuleComponent', () => {
  let component: CardViewModuleComponent;
  let fixture: ComponentFixture<CardViewModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardViewModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardViewModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
