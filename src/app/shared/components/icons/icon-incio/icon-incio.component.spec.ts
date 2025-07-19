import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconIncioComponent } from './icon-incio.component';

describe('IconIncioComponent', () => {
  let component: IconIncioComponent;
  let fixture: ComponentFixture<IconIncioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconIncioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconIncioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
