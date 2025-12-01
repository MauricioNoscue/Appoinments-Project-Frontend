import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsReviewLandingComponent } from './doctors-review-landing.component';

describe('DoctorsReviewLandingComponent', () => {
  let component: DoctorsReviewLandingComponent;
  let fixture: ComponentFixture<DoctorsReviewLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsReviewLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsReviewLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
