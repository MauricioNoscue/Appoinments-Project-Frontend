import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { BranchComponent } from './branch.component';
import { BranchService } from '../../../../shared/services/branch.service';

describe('BranchComponent', () => {
  let component: BranchComponent;
  let fixture: ComponentFixture<BranchComponent>;

  beforeEach(async () => {
    // Mock del servicio
    const branchServiceMock = {
      traerTodo: jasmine.createSpy('traerTodo').and.returnValue(of([])),
      eliminar: jasmine.createSpy('eliminar').and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      declarations: [BranchComponent], // ✅ Correcto: es standalone: false
      imports: [],
      providers: [
        // ✅ Inyectar mocks
        { provide: BranchService, useValue: branchServiceMock },
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(null) }) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
