import { Component, OnInit } from '@angular/core';
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
  ],
  templateUrl: './form-consultorio.component.html',
  styleUrls: ['./form-consultorio.component.css'],
})
export class FormConsultorioComponent implements OnInit {
  modo: 'crear' | 'editar' = 'crear';
  id?: number;

  // 💡 Declarar el form
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router
  ) {
    // ✅ Inicializar el form dentro del constructor
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(60)]],
      ubicacion: ['', [Validators.required, Validators.maxLength(80)]],
      estado: ['En uso', Validators.required],
      imagen: ['assets/images/consultorio.png', Validators.required],
    });
  }

  ngOnInit(): void {
    // Si la ruta trae :id => estamos en "editar"
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modo = 'editar';
      this.id = Number(idParam);

      // Intentar precargar desde router state (viene del listado)
      const state: any = history.state?.consultorio;
      if (state) {
        this.form.patchValue({
          nombre: state.nombre,
          ubicacion: state.ubicacion,
          estado: state.estado,
          imagen: state.imagen,
        });
      }
      // Si entran directo por URL no hay servicio: se deja vacío
    } else {
      this.modo = 'crear';
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    if (this.modo === 'crear') {
      console.log('Crear (solo mostrar, sin guardar):', this.form.value);
    } else {
      console.log('Editar (solo mostrar, sin guardar):', {
        id: this.id,
        ...this.form.value,
      });
    }

    // Volver al listado
    this.router.navigate(['admin/consultorio']);
  }

  cancelar(): void {
    this.router.navigate(['admin/consultorio']);
  }
}
