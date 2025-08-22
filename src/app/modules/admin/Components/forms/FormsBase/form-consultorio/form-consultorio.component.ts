// form-consultorio.component.ts
import { Component, OnInit, Optional, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

type Estado = 'En uso' | 'Disponible';

export interface ConsultorioForm {
  nombre: string;
  ubicacion: string;
  estado: Estado;
  imagen: string;
}

@Component({
  selector: 'app-form-consultorio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule, // para mat-dialog-title/content/actions
  ],
  templateUrl: './form-consultorio.component.html',
  styleUrls: ['./form-consultorio.component.css'],
})
export class FormConsultorioComponent implements OnInit {
  modo: 'crear' | 'editar' = 'crear';
  id?: number;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    @Optional() private dialogRef?: MatDialogRef<FormConsultorioComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data?: { modo?: 'crear' | 'editar'; consultorio?: any }
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(60)]],
      ubicacion: ['', [Validators.required, Validators.maxLength(80)]],
      estado: ['En uso', Validators.required],
      imagen: ['assets/images/consultorio.png', Validators.required],
    });
  }

  ngOnInit(): void {
    // 1) Si viene por modal, usar data
    if (this.data?.modo) {
      this.modo = this.data.modo;
      if (this.data.consultorio) {
        const c = this.data.consultorio;
        this.id = c.id;
        this.form.patchValue({
          nombre: c.nombre,
          ubicacion: c.ubicacion,
          estado: c.estado,
          imagen: c.imagen,
        });
      }
      return;
    }

    // 2) Si NO es modal, usar ruta (crear/editar por url)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modo = 'editar';
      this.id = Number(idParam);
      const state: any = history.state?.consultorio;
      if (state) {
        this.form.patchValue(state);
      }
    } else {
      this.modo = 'crear';
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    const result = { modo: this.modo, id: this.id, values: this.form.value };

    // Si estamos en modal, cerramos y devolvemos datos
    if (this.dialogRef) {
      this.dialogRef.close(result);
    } else {
      // Flujo sin modal (por ruta)
      console.log(this.modo === 'crear' ? 'Crear:' : 'Editar:', result);
      this.router.navigate(['admin/consultorio']);
    }
  }

  cancelar(): void {
    if (this.dialogRef) {
      this.dialogRef.close(null);
    } else {
      this.router.navigate(['admin/consultorio']);
    }
  }
}
