import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CardViewModuleComponent } from './card-view-module.component';

describe('CardViewModuleComponent', () => {
  let component: CardViewModuleComponent;
  let fixture: ComponentFixture<CardViewModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardViewModuleComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA]
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
