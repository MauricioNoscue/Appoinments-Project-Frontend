import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiCitasComponent } from './mi-citas.component';

describe('MiCitasComponent', () => {
  let component: MiCitasComponent;
  let fixture: ComponentFixture<MiCitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiCitasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
