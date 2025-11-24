import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestModificationComponent } from './request-modification.component';

describe('RequestModificationComponent', () => {
  let component: RequestModificationComponent;
  let fixture: ComponentFixture<RequestModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestModificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
