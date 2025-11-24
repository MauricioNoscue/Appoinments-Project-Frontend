import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { RolEditComponent } from './rol-edit.component';
import { RolService } from '../../../../../../shared/services/rol.service';

describe('RolEditComponent', () => {
  let component: RolEditComponent;
  let fixture: ComponentFixture<RolEditComponent>;

  beforeEach(async () => {
    // Mock del servicio
    const rolServiceMock = {
      actualizar: jasmine.createSpy('actualizar').and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      declarations: [RolEditComponent], // Correcto (standalone: false)
      imports: [],
      providers: [
        { provide: RolService, useValue: rolServiceMock },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: 'MODAL_DATA', useValue: { id: 1, name: 'Rol Test', description: 'Desc' } },
        // IMPORTANTE: Proveer el token 'MODAL_DATA'
        {
          provide: 'MODAL_DATA',
          useValue: { id: 1, name: 'Test', description: 'Desc' },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RolEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
