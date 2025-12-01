import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { DoctorReviewAll } from '../../../Models/reviewDoctors/reviewDoctors';
import { DoctorReviewService } from '../../../services/Reviews/doctor-review.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-doctor-review',
  standalone: false,
  templateUrl: './doctor-review.component.html',
  styleUrl: './doctor-review.component.css'
})
export class DoctorReviewComponent implements OnInit {
Math = Math;
@ViewChild('reviewDialog') reviewDialog: any;

reviewForm!: FormGroup;

  doctor!: DoctorReviewAll;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private reviewService: DoctorReviewService,
     private dialog: MatDialog,
  private fb: FormBuilder,
  private auhteservice : AuthService
  ) {}

  ngOnInit(): void {
      const userId = this.auhteservice.getUserId();

     this.reviewForm = this.fb.group({
    rating: [5, Validators.required],
    comment: ['']
  });
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = true;
      return;
    }

    this.reviewService.getDoctorWithReviews(id).subscribe({
      next: (data) => {
        this.doctor = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar las reseñas del doctor', 'error');
      }
    });
  }

  openCreateReview() {
  

  this.dialog.open(this.reviewDialog);
}

submitReview() {
  const userId = this.auhteservice.getUserId();
  if (!userId) {
    Swal.fire('Error', 'Debes iniciar sesión para dejar una reseña', 'error');
    return;
  }

  const payload = {
    doctorId: this.doctor.id,
    userId: userId,
    rating: this.reviewForm.value.rating,
    comment: this.reviewForm.value.comment
  };

  console.log('Payload de reseña:', payload);

  this.reviewService.crear(payload).subscribe({
    next: (newReview) => {

      // Cerrar el modal
      this.dialog.closeAll();

      // Insertar la reseña EXACTA que devuelve el backend
      this.doctor.reviews.unshift(newReview);

      // Actualizar total
      this.doctor.totalReviews++;

      // Recalcular promedio bien
      const sum = this.doctor.reviews.reduce((acc, r) => acc + r.rating, 0);
      this.doctor.averageRating = sum / this.doctor.totalReviews;

      Swal.fire('Reseña creada', 'Tu reseña ha sido publicada.', 'success');
    },
    error: () => Swal.fire('Error', 'No se pudo crear la reseña', 'error')
  });
}



  // Mostrar las estrellas
  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  // Porcentaje para la barra de cada estrella
  getPercent(stars: number): number {
    if (!this.doctor?.totalReviews) return 0;
    const count = this.doctor.ratingsDistribution?.[stars] ?? 0;
    return Math.round((count / this.doctor.totalReviews) * 100);
  }

}
