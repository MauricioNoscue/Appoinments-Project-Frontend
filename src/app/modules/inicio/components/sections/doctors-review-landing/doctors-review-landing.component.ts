import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DoctorList } from '../../../../../shared/Models/hospital/DoctorListModel';
import { DoctorReviewService } from '../../../../../shared/services/Reviews/doctor-review.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctors-review-landing',
standalone: false,
  templateUrl: './doctors-review-landing.component.html',
  styleUrl: './doctors-review-landing.component.css'
})
export class DoctorsReviewLandingComponent  implements  OnInit{



  private service = inject(DoctorReviewService);

  doctors: DoctorList[] = [];

  @ViewChild('carousel', { static: true }) carousel!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.loadDoctors();
    this.autoSlide();
  }

  loadDoctors(): void {
    this.service.getDcotros().subscribe({
      next: (data) => (this.doctors = data),
      error: (err) => console.error(err)
    });
  }

  // ===== Navegación del carrusel =====
  next(): void {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  prev(): void {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  autoSlide(): void {
    setInterval(() => this.next(), 4000);
  }

 
  private router = inject(Router);

  goToDoctor(id: number): void {
    this.router.navigate(['/inicio/doctor-review', id]);
  }
  trackById(_: number, item: DoctorList): number {
    return item.id;
  }
  
}
