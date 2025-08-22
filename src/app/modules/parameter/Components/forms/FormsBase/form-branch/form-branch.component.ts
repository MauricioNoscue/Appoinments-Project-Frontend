import {Component,OnInit,Optional,Inject,Input,Output,EventEmitter,} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormGroup,FormBuilder,Validators,FormsModule,ReactiveFormsModule,} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule,MatDialogRef,MAT_DIALOG_DATA,} from '@angular/material/dialog';
import {Branch,BranchCreated,BranchEdit,} from '../../../../../../shared/Models/parameter/Branch';
import {InstitutionList,InstitutionOption,} from '../../../../../../shared/Models/parameter/InstitutionModel';
import { InstitutionService } from '../../../../../../shared/services/institution.service';

@Component({
  selector: 'app-form-branch',
  standalone: true,
  templateUrl: './form-branch.component.html',
  styleUrls: ['./form-branch.component.css'],
  imports: [CommonModule,MatFormFieldModule,MatSelectModule,MatOptionModule,MatInputModule,ReactiveFormsModule,FormsModule,MatDialogModule],
})
export class FormBranchComponent implements OnInit {
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() data?: Branch;
  @Output() formSubmit = new EventEmitter<BranchCreated | BranchEdit>();

  branchForm: FormGroup;
  institucions: InstitutionOption[] = [];

  constructor(
    private fb: FormBuilder,
    private institutionService: InstitutionService,

    // Soporte si algún día lo vuelves a usar con tu contenedor genérico:
    @Optional()
    @Inject('MODAL_DATA')
    private modalData?: { modo: 'create' | 'edit'; data?: Branch },

    // Datos cuando lo abrimos directo con MatDialog (recomendado):
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    private dialogData?: { modo?: 'create' | 'edit'; branch?: Branch },

    @Optional() private dialogRef?: MatDialogRef<FormBranchComponent>
  ) {
    this.branchForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      institutionId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarInstituciones();

    const modoIn = this.modalData?.modo ?? this.dialogData?.modo ?? this.modo;
    const dataIn = this.modalData?.data ?? this.dialogData?.branch ?? this.data;

    this.modo = modoIn;
    if (modoIn === 'edit' && dataIn) {
      this.branchForm.patchValue(dataIn);
    }
  }

  private cargarInstituciones(): void {
    this.institutionService.traerTodo().subscribe({
      next: (data: InstitutionList[]) => {
        this.institucions = data.map((inst) => ({
          id: inst.id,
          name: inst.name,
        }));
      },
      error: (err) => console.error('Error al cargar instituciones:', err),
    });
  }

  onSubmit(): void {
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      return;
    }

    const payload: BranchCreated | BranchEdit =
      this.modo === 'edit' &&
      (this.modalData?.data?.id || this.dialogData?.branch?.id)
        ? {
            id: (this.modalData?.data?.id ?? this.dialogData?.branch?.id)!,
            ...this.branchForm.value,
          }
        : { ...this.branchForm.value };

    // Si estamos en diálogo, cerramos y devolvemos datos
    if (this.dialogRef) this.dialogRef.close(payload);

    // Si alguien escucha el output, también lo emitimos (reutilizable fuera del diálogo)
    this.formSubmit.emit(payload);
  }

  cancelar(): void {
    if (this.dialogRef) this.dialogRef.close(null);
  }

  getFieldError(fieldName: string): string {
    const field = this.branchForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength'])
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['email']) return `El correo no es válido`;
    }
    return '';
  }
}
