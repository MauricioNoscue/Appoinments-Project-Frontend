import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCitationAvailableComponent } from './view-citation-available.component';

describe('ViewCitationAvailableComponent', () => {
  let component: ViewCitationAvailableComponent;
  let fixture: ComponentFixture<ViewCitationAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCitationAvailableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCitationAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
