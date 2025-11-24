import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CardBasicComponent } from './card-basic.component';

describe('CardBasicComponent', () => {
  let component: CardBasicComponent;
  let fixture: ComponentFixture<CardBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardBasicComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
