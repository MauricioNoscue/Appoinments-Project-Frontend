import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RolPermisosResponse, AssignRolesDto, AssignPermissionsDto, PermissionAssignmentDto, RolList, UpdateRolFormPermissionsDto, UpdateUserRolesDto } from '../../../../../shared/Models/security/RolModel';
import { UserDetailDto } from '../../../../../shared/Models/security/userModel';
import { RolFormPermissionService } from '../../../../../shared/services/rol-form-permission.service';
import { UserService } from '../../../../../shared/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, catchError, of, finalize } from 'rxjs';
import { FormList } from '../../../../../shared/Models/security/FormModel';
import { PermissionListar } from '../../../../../shared/Models/security/permission';
import { RolService } from '../../../../../shared/services/rol.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-role-management',
standalone:false,
  templateUrl: './user-role-management.component.html',
  styleUrl: './user-role-management.component.css'
})
export class UserRoleManagementComponent  implements OnInit{
 userId: number =0;

  // Data properties
  userDetail: UserDetailDto | null = null;
  userRolesPermissions: RolPermisosResponse[] = [];
  availableRoles: RolList[] = [];
  availableForms: FormList[] = [];
  availablePermissions: PermissionListar[] = [];

  // UI State
  isLoading = false;
  selectedTabIndex = 0;
  
  // Forms
  rolesForm: FormGroup;
  permissionsForm: FormGroup;
  
  // Selected data
  selectedRoleForPermissions: RolList | null = null;
  selectedRolePermissions: { [formId: number]: number } = {};

  constructor(
    private rt :ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userService: UserService, // UserService - inject your actual service
    private rolFormPermissionService: RolFormPermissionService, // RolFormPermissionService - inject your actual service
    private roleService: RolService, // Service for roles list - inject your actual service
    private formService: FormService, // Service for forms list - inject your actual service
    private permissionService: PermissionService // Service for permissions list - inject your actual service
  ) {
    this.rolesForm = this.fb.group({
      selectedRoles: [[], Validators.required]
    });

    this.permissionsForm = this.fb.group({
      selectedRole: [null, Validators.required]
    });
  }

  ngOnInit(): void {

    this.userId = Number(this.rt.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.loadInitialData();
    }
  }

  private loadInitialData(): void {
    this.isLoading = true;
    
    const requests = {
      userDetail: this.userService.getUserDetail(this.userId),
      rolesPermissions: this.userService.getRolesAndPermissions(this.userId),
      roles: this.roleService.traerTodo(), // Assuming this method exists
      forms: this.formService.traerTodo(), // Assuming this method exists
      permissions: this.permissionService.getall() // Assuming this method exists
    };

    forkJoin(requests).pipe(
      catchError(error => {
        this.showError('Error al cargar los datos iniciales');
        console.error('Error loading initial data:', error);
        return of({
          userDetail: null,
          rolesPermissions: [],
          roles: [],
          forms: [],
          permissions: []
        });
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(results => {
      this.userDetail = results.userDetail;
      this.userRolesPermissions = results.rolesPermissions;
      this.availableRoles = results.roles?.filter(r => !r.IsDeleted) || [];
      this.availableForms = results.forms?.filter(f => !f.isDeleted) || [];
      this.availablePermissions = results.permissions?.filter(p => !p.isDeleted) || [];
      
      this.initializeFormsData();
    });
  }

  private initializeFormsData(): void {
    if (this.userDetail?.roles && this.availableRoles.length > 0) {
      const userRoleIds = this.availableRoles
        .filter(role => this.userDetail!.roles.includes(role.name))
        .map(role => role.id);
      
      this.rolesForm.patchValue({
        selectedRoles: userRoleIds
      });
    }
  }

  // Role Management Methods
  onAssignRoles(): void {
    if (this.rolesForm.valid) {
      const selectedRoleIds = this.rolesForm.value.selectedRoles;
      
      const dto: AssignRolesDto = {
        userId: this.userId,
        rolIds: selectedRoleIds
      };

      this.isLoading = true;
      this.userService.assignMultipleRoles(dto).pipe(
        catchError(error => {
          this.showError('Error al asignar roles');
          console.error('Error assigning roles:', error);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      ).subscribe(result => {
        if (result !== null) {
          this.showSuccess('Roles asignados correctamente');
          this.refreshUserData();
        }
      });
    }
  }

  onUpdateRoles(): void {
    if (this.rolesForm.valid) {
      const selectedRoleIds = this.rolesForm.value.selectedRoles;
      
      const dto: UpdateUserRolesDto = {
        userId: this.userId,
        rolIds: selectedRoleIds
      };

      this.isLoading = true;
      this.userService.updateUserRoles(dto).pipe(
        catchError(error => {
          this.showError('Error al actualizar roles');
          console.error('Error updating roles:', error);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      ).subscribe(result => {
        if (result !== null) {
          this.showSuccess('Roles actualizados correctamente');
          this.refreshUserData();
        }
      });
    }
  }
  // Helper methods
  private refreshUserData(): void {
    const requests = {
      userDetail: this.userService.getUserDetail(this.userId),
      rolesPermissions: this.userService.getRolesAndPermissions(this.userId)
    };

    forkJoin(requests).pipe(
      catchError(error => {
        console.error('Error refreshing user data:', error);
        return of({
          userDetail: this.userDetail,
          rolesPermissions: this.userRolesPermissions
        });
      })
    ).subscribe(results => {
      this.userDetail = results.userDetail;
      this.userRolesPermissions = results.rolesPermissions;
      this.initializeFormsData();
      
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

  // Utility methods for template
  getRolePermissionsByForm(rolePermissions: RolPermisosResponse) {
    const groupedByForm: { [formName: string]: string[] } = {};
    
    rolePermissions.permisos.forEach(permiso => {
      if (!groupedByForm[permiso.form]) {
        groupedByForm[permiso.form] = [];
      }
      groupedByForm[permiso.form].push(permiso.permiso);
    });
    
    return groupedByForm;
  }
}
