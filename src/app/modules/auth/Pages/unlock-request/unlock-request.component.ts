import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ModificationRequestCreateDto, TypeRequest } from '../../../../shared/Models/Request/ModificationRequest';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestServiceService } from '../../../../shared/services/Request/request-service.service';

@Component({
  selector: 'app-unlock-request',
  standalone: false,
  templateUrl: './unlock-request.component.html',
  styleUrl: './unlock-request.component.css'
})
export class UnlockRequestComponent  implements OnInit{


  form!: FormGroup;

  constructor(private fb: FormBuilder,    private route: ActivatedRoute ,private service :RequestServiceService,private router: Router) {}

  ngOnInit(): void {

      const userId = Number(this.route.snapshot.queryParamMap.get('userId'));

    console.log('UserId recibido desde login:', userId);
    this.form = this.fb.group({
      reason: ['', Validators.required],
      observation: [''],

      // estos datos los enviarás tú desde autenticación
      userId: [userId],
      typeRequest: [TypeRequest.AccountUnlock],
      statustypesId: [7] // 1 = Pendiente, ajústalo a tu enum real
    });
  }

   submit(): void {
    if (this.form.invalid) return;

    const payload: ModificationRequestCreateDto = this.form.value;

    console.log('Payload enviado:', payload);

    this.service.crear(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Solicitud enviada con éxito',
          showConfirmButton: false,
          timer: 1500
        });

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error al enviar solicitud:', err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message ?? 'No se pudo enviar la solicitud'
        });
      }
    });
  }


}
