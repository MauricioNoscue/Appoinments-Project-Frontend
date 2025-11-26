import { Injectable } from '@angular/core';
import { HttpClient } from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { DoctorReviewAll, DoctorReviewCreateDto, DoctorReviewListDto, DoctorReviewEditDto } from '../../Models/reviewDoctors/reviewDoctors';
import { ServiceBaseService } from '../base/service-base.service';
import { DoctorList } from '../../Models/hospital/DoctorListModel';

@Injectable({
  providedIn: 'root'
})
export class DoctorReviewService extends ServiceBaseService<DoctorReviewListDto, DoctorReviewCreateDto, DoctorReviewEditDto> {

  constructor() {
    super('DoctorReview');
  }

  private ur = environment.apiURL


  getDoctorWithReviews(id: number): Observable<DoctorReviewAll> {
    return this.http.get<DoctorReviewAll>(`${this.ur}/api/doctor/${id}/doctorReview`);
  }


    getDcotros(): Observable<DoctorList[]> {
    return this.http.get<DoctorList[]>(`${this.ur}/api/doctor/GetAllDoctors`);
  }


}