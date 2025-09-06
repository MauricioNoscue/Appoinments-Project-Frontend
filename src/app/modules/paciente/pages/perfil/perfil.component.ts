import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService, UserProfile } from '../../../../shared/services/profile.service';
import { EditProfileSectionDialogComponent } from '../perfil/edit-profile-section-dialog/edit-profile-section-dialog.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: false
})
export class PerfilComponent implements OnInit, OnDestroy {

  user!: UserProfile;
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(private profile: ProfileService, private dialog: MatDialog) { }

  ngOnInit(): void {
    // Por ahora "usuario quemado" (id 42). Luego: usar id desde auth.
    this.profile.loadById(1).pipe(takeUntil(this.destroy$)).subscribe({
      next: u => {
        this.user = u;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); this.destroy$.complete();
  }

  get initials(): string {
    if (!this.user?.fullName) return '';
    return this.user.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0]?.toUpperCase())
      .join('');
  }

  formatDocument(): string {
    if (!this.user) return '';
    const n = this.user.documentNumber.replace(/\D/g, '');
    // puntos cada 3: 1.023.456.789
    return `${this.user.documentType} ${n}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Donut con conic-gradient
  get donutStyle(): any {
    const items = this.user?.yearStats ?? [];
    const total = this.totalYearStats || 1;
    let acc = 0;
    const parts = items.map(it => {
      const start = (acc / total) * 360;
      const end = ((acc + it.value) / total) * 360;
      acc += it.value;
      return `${it.color} ${start}deg ${end}deg`;
    }).join(', ');
    return { background: `conic-gradient(${parts})` };
  }
  get totalYearStats(): number {
    return (this.user?.yearStats ?? []).reduce((acc, it) => acc + it.value, 0);
  }


  openEdit(section: 'personal' | 'health' | 'contact'): void {
    const values =
      section === 'personal' ? { fullName: this.user.fullName, gender: this.user.gender } :
        section === 'health' ? { epsName: this.user.epsName, healthRegime: this.user.healthRegime } :
          { phoneNumber: this.user.phoneNumber, email: this.user.email };

    const ref = this.dialog.open(EditProfileSectionDialogComponent, {
      width: '560px',
      data: { section, values }
    });

    ref.afterClosed().subscribe((result: any) => {
      if (!result) return;

      if (section === 'personal') {
        this.profile.updatePersonal(result).subscribe(u => this.user = u);
      } else if (section === 'health') {
        this.profile.updateHealth(result).subscribe(u => this.user = u);
      } else {
        this.profile.updateContact(result).subscribe(u => this.user = u);
      }
    });
  }
}
