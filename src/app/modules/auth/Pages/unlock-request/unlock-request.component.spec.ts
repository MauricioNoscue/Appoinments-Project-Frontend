import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockRequestComponent } from './unlock-request.component';

describe('UnlockRequestComponent', () => {
  let component: UnlockRequestComponent;
  let fixture: ComponentFixture<UnlockRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlockRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlockRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
