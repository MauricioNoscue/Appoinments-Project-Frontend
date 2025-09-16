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
  form!: FormGroup;

  // Sucursales
  branches: BranchList[] = [];
  loadingBranches = false;

  // Imagen por defecto (ajusta la ruta al assets real de tu app)
  readonly DEFAULT_IMG = 'assets/images/consultorio.png';

  // Imágenes "quemadas" disponibles para elegir
  readonly PRESET_IMAGES = [
    {
      label: 'Clínica – Blanco',
      url: 'assets/images/grafica.png',
    },
    { label: 'Clínica – Azul', url: 'assets/images/doctor.jpg' },
    { label: 'Odontología', url: 'assets/images/img-home.png' },
    { label: 'Pediatría', url: 'assets/images/fondo-doctor.png' },
    { label: 'Cardiología', url: 'assets/images/fondo.png' },
  ];

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
        image?: string; // ← añadimos image aquí también
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
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
        ],
      ],
      roomNumber: [
        null,
        [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
      ],
      floor: [
        null,
        [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)],
      ],
      image: [this.DEFAULT_IMG], // ← nuevo control (URL)
    });

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
          image: c.image || this.DEFAULT_IMG, // ← precarga imagen
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
      if (state) {
        this.form.patchValue({
          ...state,
          image: state?.image || this.DEFAULT_IMG,
        });
      }
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
  soloLetras(event: KeyboardEvent) {
    const key = event.key;
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
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(key)) event.preventDefault();
  }
  soloLetrasPaste(event: ClipboardEvent) {
    const pasted = (event.clipboardData?.getData('text') ?? '').trim();
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(pasted)) event.preventDefault();
  }
  soloNumeros(event: KeyboardEvent) {
    const key = event.key;
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
    if (!/^\d$/.test(key)) event.preventDefault();
  }
  soloNumerosPaste(event: ClipboardEvent) {
    const pasted = (event.clipboardData?.getData('text') ?? '').trim();
    if (!/^\d+$/.test(pasted)) event.preventDefault();
  }
  // ─────────────────────────────────────────────────────────────

  guardar(): void {
    if (this.form.invalid) return;

    const result = {
      modo: this.modo,
      id: this.id,
      values: this.form.value, // ← incluye image (URL)
    };

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
