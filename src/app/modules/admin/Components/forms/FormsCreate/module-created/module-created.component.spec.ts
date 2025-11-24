import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ModuleCreatedComponent } from './module-created.component';
import { ModuleService } from '../../../../../../shared/services/module.service';

describe('ModuleCreatedComponent', () => {
  let component: ModuleCreatedComponent;
  let fixture: ComponentFixture<ModuleCreatedComponent>;

  beforeEach(async () => {
    const moduleServiceMock = {
      crear: jasmine.createSpy('crear').and.returnValue(of({})),
    };
    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      declarations: [ModuleCreatedComponent],
      imports: [],
      providers: [
        { provide: ModuleService, useValue: moduleServiceMock },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
