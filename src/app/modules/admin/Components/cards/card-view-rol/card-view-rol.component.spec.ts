import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CardViewRolComponent } from './card-view-rol.component';

describe('CardViewRolComponent', () => {
  let component: CardViewRolComponent;
  let fixture: ComponentFixture<CardViewRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardViewRolComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA]
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
