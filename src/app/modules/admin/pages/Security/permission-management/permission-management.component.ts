import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, finalize, forkJoin } from 'rxjs';
import { FormList } from '../../../../../shared/Models/security/FormModel';
import { PermissionListar } from '../../../../../shared/Models/security/permission';
import { RolList, RolPermisosResponse, PermissionAssignmentDto, AssignPermissionsDto, UpdateRolFormPermissionsDto } from '../../../../../shared/Models/security/RolModel';
import { RolFormPermissionService } from '../../../../../shared/services/rol-form-permission.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { RolService } from '../../../../../shared/services/rol.service';

@Component({
  selector: 'app-permission-management',
standalone:false,
  templateUrl: './permission-management.component.html',
  styleUrl: './permission-management.component.css'
})
export class PermissionManagementComponent implements OnInit {
   permissionsForm: FormGroup;
  selectedRoleForPermissions: RolList | null = null;
  selectedRolePermissions: { [formId: number]: number } = {};
  isLoading = false;

  availableRoles: RolList[] = [];
  availableForms: FormList[] = [];
  availablePermissions: PermissionListar[] = [];
  userRolesPermissions: RolPermisosResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private rolService: RolService,
    private formService: FormService,
    private permissionService: PermissionService,
    private rolFormPermissionService: RolFormPermissionService,
    private snackBar: MatSnackBar
  ) {
    this.permissionsForm = this.fb.group({
      selectedRole: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.isLoading = true;
    forkJoin({
      roles: this.rolService.traerTodo(),
      forms: this.formService.traerTodo(),
      permissions: this.permissionService.getall(),
      // rolesPermissions: this.rolFormPermissionService.()
    }).pipe(
      catchError(error => {
        this.showError('Error al cargar datos');
        console.error(error);
        return of({
          roles: [],
          forms: [],
          permissions: [],
          rolesPermissions: []
        });
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(({ roles, forms, permissions }) => {
      this.availableRoles = roles?.filter(r => !r.IsDeleted) || [];
      this.availableForms = forms?.filter(f => !f.isDeleted) || [];
      this.availablePermissions = permissions?.filter(p => !p.isDeleted) || [];
      // this.userRolesPermissions = rolesPermissions || [];
    });
  }

  onRoleSelectionChange(role: RolList): void {
    this.selectedRoleForPermissions = role;
    this.loadRolePermissions(role.id);
  }

  private loadRolePermissions(roleId: number): void {
    const rolePermissions = this.userRolesPermissions.find(rp =>
      this.availableRoles.find(r => r.name === rp.rol)?.id === roleId
    );

    this.selectedRolePermissions = {};

    if (rolePermissions) {
      rolePermissions.permisos.forEach(permiso => {
        const form = this.availableForms.find(f => f.name === permiso.form);
        const permission = this.availablePermissions.find(p => p.name === permiso.permiso);
        if (form && permission) {
          this.selectedRolePermissions[form.id] = permission.id;
        }
      });
    }
  }

  onPermissionChange(formId: number, permissionId: number): void {
    if (permissionId) {
      this.selectedRolePermissions[formId] = permissionId;
    } else {
      delete this.selectedRolePermissions[formId];
    }
  }

  getSelectedPermissionForForm(formId: number): number | null {
    return this.selectedRolePermissions[formId] || null;
  }

  onAssignPermissions(): void {
    if (!this.selectedRoleForPermissions) {
      this.showError('Selecciona un rol primero');
      return;
    }

    const permissions: PermissionAssignmentDto[] = Object.entries(this.selectedRolePermissions)
      .map(([formId, permissionId]) => ({
        formId: parseInt(formId),
        permissionId: permissionId
      }));

    const dto: AssignPermissionsDto = {
      rolId: this.selectedRoleForPermissions.id,
      permissions: permissions
    };

    this.isLoading = true;
    this.rolFormPermissionService.assignPermissions(dto).pipe(
      catchError(error => {
        this.showError('Error al asignar permisos');
        console.error(error);
        return of(null);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(result => {
      if (result !== null) {
        this.showSuccess('Permisos asignados correctamente');
        this.loadInitialData();
      }
    });
  }

  onUpdatePermissions(): void {
    if (!this.selectedRoleForPermissions) {
      this.showError('Selecciona un rol primero');
      return;
    }

    const permissions: PermissionAssignmentDto[] = Object.entries(this.selectedRolePermissions)
      .map(([formId, permissionId]) => ({
        formId: parseInt(formId),
        permissionId: permissionId
      }));

    const dto: UpdateRolFormPermissionsDto = {
      rolId: this.selectedRoleForPermissions.id,
      permissions: permissions
    };

    this.isLoading = true;
    this.rolFormPermissionService.updatePermissions(dto).pipe(
      catchError(error => {
        this.showError('Error al actualizar permisos');
        console.error(error);
        return of(null);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(result => {
      if (result !== null) {
        this.showSuccess('Permisos actualizados correctamente');
        this.loadInitialData();
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
