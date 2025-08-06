import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleCreatedComponent } from './module-created.component';

describe('ModuleCreatedComponent', () => {
  let component: ModuleCreatedComponent;
  let fixture: ComponentFixture<ModuleCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleCreatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
