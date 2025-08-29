import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacionPersonaComponent } from './relacion-persona.component';

describe('RelacionPersonaComponent', () => {
  let component: RelacionPersonaComponent;
  let fixture: ComponentFixture<RelacionPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelacionPersonaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelacionPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
