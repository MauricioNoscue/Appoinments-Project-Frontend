import { Component } from '@angular/core';
import { ModuleService } from '../../../../../../shared/services/module.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-module-created',
  standalone: false,
  templateUrl: './module-created.component.html',
  styleUrl: './module-created.component.css',
})
export class ModuleCreatedComponent {
  constructor(
    private dialogRef: MatDialogRef<ModuleCreatedComponent>,
    private route: Router,
    private service: ModuleService
  ) {}

  onFormSubmit(form: any) {
    this.service.crear(form).subscribe(() => this.dialogRef.close(true));
  }
}
