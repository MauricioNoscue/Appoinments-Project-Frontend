import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { PermissionComponent } from './permission.component';
import { PermissionService } from '../../../../../shared/services/permission.service';

describe('PermissionComponent', () => {
  let component: PermissionComponent;
  let fixture: ComponentFixture<PermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermissionComponent], // ✅ Correcto
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // ✅ Mock del servicio
        {
          provide: PermissionService,
          useValue: {
            traerTodo: () => of([]),
            eliminar: () => of({}),
          },
        },
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(null) }) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
