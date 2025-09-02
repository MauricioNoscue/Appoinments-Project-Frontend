import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheduleCardComponent } from './shedule-card.component';

describe('SheduleCardComponent', () => {
  let component: SheduleCardComponent;
  let fixture: ComponentFixture<SheduleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheduleCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheduleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
