import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verify2FAComponent } from './verify2-fa.component';

describe('Verify2FAComponent', () => {
  let component: Verify2FAComponent;
  let fixture: ComponentFixture<Verify2FAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Verify2FAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Verify2FAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
