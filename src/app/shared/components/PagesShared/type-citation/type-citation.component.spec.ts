import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeCitationComponent } from './type-citation.component';

describe('TypeCitationComponent', () => {
  let component: TypeCitationComponent;
  let fixture: ComponentFixture<TypeCitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeCitationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeCitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
