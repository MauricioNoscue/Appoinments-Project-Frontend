import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { RolCreatedComponent } from './rol-created.component';
import { RolService } from '../../../../../../shared/services/rol.service';

describe('RolCreatedComponent', () => {
  let component: RolCreatedComponent;
  let fixture: ComponentFixture<RolCreatedComponent>;

  beforeEach(async () => {
    const rolServiceMock = {
      crear: jasmine.createSpy('crear').and.returnValue(of({})),
    };
    const routerMock = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      declarations: [RolCreatedComponent], // Correcto (standalone: false)
      providers: [
        { provide: RolService, useValue: rolServiceMock },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RolCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
