import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeCitationModalComponent } from './type-citation-modal.component';

describe('TypeCitationModalComponent', () => {
  let component: TypeCitationModalComponent;
  let fixture: ComponentFixture<TypeCitationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeCitationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeCitationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
