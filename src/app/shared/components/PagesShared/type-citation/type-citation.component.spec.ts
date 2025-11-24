import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TypeCitationComponent } from './type-citation.component';

describe('TypeCitationComponent', () => {
  let component: TypeCitationComponent;
  let fixture: ComponentFixture<TypeCitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeCitationComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA]
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
