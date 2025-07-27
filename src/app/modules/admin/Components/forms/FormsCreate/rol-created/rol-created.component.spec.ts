import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolCreatedComponent } from './rol-created.component';

describe('RolCreatedComponent', () => {
  let component: RolCreatedComponent;
  let fixture: ComponentFixture<RolCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolCreatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
