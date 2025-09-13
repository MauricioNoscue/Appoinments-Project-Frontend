import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationDetailsDialogComponent } from './citation-details-dialog.component';

describe('CitationDetailsDialogComponent', () => {
  let component: CitationDetailsDialogComponent;
  let fixture: ComponentFixture<CitationDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CitationDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitationDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
