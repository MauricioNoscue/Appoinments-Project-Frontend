import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestModificationDetailComponent } from './request-modification-detail.component';

describe('RequestModificationDetailComponent', () => {
  let component: RequestModificationDetailComponent;
  let fixture: ComponentFixture<RequestModificationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestModificationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestModificationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
