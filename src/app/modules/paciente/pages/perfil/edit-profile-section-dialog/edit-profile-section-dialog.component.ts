import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

function coCellphone() {
  const re = /^3\d{9}$/; // celular colombiano
  return (c: AbstractControl): ValidationErrors | null =>
    !c.value ? null : re.test(c.value) ? null : { coPhone: true };
}

export type SectionType = 'personal' | 'health' | 'contact';

@Component({
  selector: 'app-edit-profile-section-dialog',
  templateUrl: './edit-profile-section-dialog.component.html',
  styleUrls: ['./edit-profile-section-dialog.component.css'],
  standalone: false
})
export class EditProfileSectionDialogComponent {
  form: FormGroup;
  title = '';
  section: SectionType;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<EditProfileSectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      section: SectionType,
      values: any
    }
  ) {
    this.section = data.section;

    if (this.section === 'personal') {
      this.title = 'Editar información personal';
      this.form = this.fb.group({
        fullName: [data.values.fullName, [Validators.required, Validators.minLength(2)]],
        gender: [data.values.gender, [Validators.required]],
      });
    } else if (this.section === 'health') {
      this.title = 'Editar información de salud';
      this.form = this.fb.group({
        epsName: [data.values.epsName, [Validators.required]],
        healthRegime: [data.values.healthRegime, [Validators.required]],
      });
    } else {
      this.title = 'Editar contacto';
      this.form = this.fb.group({
        phoneNumber: [data.values.phoneNumber, [Validators.required, coCellphone()]],
        email: [data.values.email, [Validators.required, Validators.email]],
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.ref.close(this.form.value);
  }

  cancel(): void {
    this.ref.close();
  }
}
