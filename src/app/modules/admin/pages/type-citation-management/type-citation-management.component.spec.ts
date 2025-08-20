import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeCitationManagementComponent } from './type-citation-management.component';

describe('TypeCitationManagementComponent', () => {
  let component: TypeCitationManagementComponent;
  let fixture: ComponentFixture<TypeCitationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeCitationManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeCitationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
