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

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

// ⚠ Ajusta estas rutas a tu proyecto
import { BranchList } from '../../../../../../shared/Models/parameter/Branch';
import { BranchService } from '../../../../../../shared/services/branch.service';

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
    MatDialogModule,
  ],
  templateUrl: './form-consultorio.component.html',
  styleUrls: ['./form-consultorio.component.css'],
})
export class FormConsultorioComponent implements OnInit {
  modo: 'crear' | 'editar' = 'crear';
  id?: number;
  form!: FormGroup; // se inicializa en ngOnInit

  // Sucursales para el select
  branches: BranchList[] = [];
  loadingBranches = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private branchService: BranchService,
    @Optional() private dialogRef?: MatDialogRef<FormConsultorioComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data?: {
      modo?: 'crear' | 'editar';
      consultorio?: {
        id: number;
        branchId: number;
        name: string;
        roomNumber: number;
        floor: number;
      };
    }
  ) {}

  ngOnInit(): void {
    // ✅ Inicializamos el formulario con validaciones
    this.form = this.fb.group({
      branchId: [null, [Validators.required]],
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/), // solo letras y espacios
        ],
      ],
      roomNumber: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^\d+$/), // solo números
        ],
      ],
      floor: [
        null,
        [
          Validators.required,
          Validators.min(0), // cambia a 1 si quieres empezar en 1
          Validators.pattern(/^\d+$/), // solo números
        ],
      ],
    });

    // cargar sucursales para el select
    this.cargarBranches();

    // 1) Si viene por modal
    if (this.data?.modo) {
      this.modo = this.data.modo;
      if (this.data.consultorio) {
        const c = this.data.consultorio;
        this.id = c.id;
        this.form.patchValue({
          branchId: c.branchId,
          name: c.name,
          roomNumber: c.roomNumber,
          floor: c.floor,
        });
      }
      return;
    }

    // 2) Si viene por ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modo = 'editar';
      this.id = Number(idParam);
      const state: any = history.state?.consultorio;
      if (state) this.form.patchValue(state);
    } else {
      this.modo = 'crear';
    }
  }

  private cargarBranches() {
    this.loadingBranches = true;
    this.branchService.traerTodo().subscribe({
      next: (res: BranchList[]) => {
        this.branches = res ?? [];
        this.loadingBranches = false;
      },
      error: (e) => {
        console.error('Error cargando branches', e);
        this.loadingBranches = false;
      },
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Bloqueadores de entrada (teclado/pegar)
  // ─────────────────────────────────────────────────────────────

  // Permitir solo letras y espacios (para 'name')
  soloLetras(event: KeyboardEvent) {
    const key = event.key;
    // Teclas de control permitidas
    const controlKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Home',
      'End',
    ];
    if (controlKeys.includes(key)) return;

    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }

  soloLetrasPaste(event: ClipboardEvent) {
    const pasted = (event.clipboardData?.getData('text') ?? '').trim();
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(pasted)) {
      event.preventDefault();
    }
  }

  // Permitir solo dígitos (para 'roomNumber' y 'floor')
  soloNumeros(event: KeyboardEvent) {
    const key = event.key;
    // Teclas de control permitidas
    const controlKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Home',
      'End',
    ];
    if (controlKeys.includes(key)) return;

    if (!/^\d$/.test(key)) {
      event.preventDefault();
    }
  }

  soloNumerosPaste(event: ClipboardEvent) {
    const pasted = (event.clipboardData?.getData('text') ?? '').trim();
    if (!/^\d+$/.test(pasted)) {
      event.preventDefault();
    }
  }

  // ─────────────────────────────────────────────────────────────

  guardar(): void {
    if (this.form.invalid) return;

    const result = { modo: this.modo, id: this.id, values: this.form.value };

    if (this.dialogRef) {
      this.dialogRef.close(result);
    } else {
      console.log(this.modo === 'crear' ? 'Crear:' : 'Editar:', result);
      this.router.navigate(['admin/consultorio']);
    }
  }

  cancelar(): void {
    if (this.dialogRef) this.dialogRef.close(null);
    else this.router.navigate(['admin/consultorio']);
  }
}
