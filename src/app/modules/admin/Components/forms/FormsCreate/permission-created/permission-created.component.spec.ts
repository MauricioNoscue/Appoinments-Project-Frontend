import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PermissionCreatedComponent } from './permission-created.component';
import { PermissionService } from '../../../../../../shared/services/permission.service';

describe('PermissionCreatedComponent', () => {
  let component: PermissionCreatedComponent;
  let fixture: ComponentFixture<PermissionCreatedComponent>;

  beforeEach(async () => {
    const permissionServiceMock = {
      crear: jasmine.createSpy('crear').and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [PermissionCreatedComponent], // Standalone va aquí
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PermissionService, useValue: permissionServiceMock },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
