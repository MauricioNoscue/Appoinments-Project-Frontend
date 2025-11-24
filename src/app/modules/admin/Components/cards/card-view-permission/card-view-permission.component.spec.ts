import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CardViewPermissionComponent } from './card-view-permission.component';

describe('CardViewPermissionComponent', () => {
  let component: CardViewPermissionComponent;
  let fixture: ComponentFixture<CardViewPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardViewPermissionComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardViewPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
