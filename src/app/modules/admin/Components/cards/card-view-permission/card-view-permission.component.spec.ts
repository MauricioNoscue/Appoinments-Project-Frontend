import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardViewPermissionComponent } from './card-view-permission.component';

describe('CardViewPermissionComponent', () => {
  let component: CardViewPermissionComponent;
  let fixture: ComponentFixture<CardViewPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardViewPermissionComponent]
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
