import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from '../../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private RESERVATION_URL = 'http://localhost:5000/reservations/';

  constructor(private httpClient: HttpClient) { }

  getReservationByClientId(clientId: string): Observable<Reservation[]> {
    return this.httpClient.get<Reservation[]>(`${this.RESERVATION_URL}getByClientId/${clientId}`);
  }

  updateReservationStatus(reservationId: string, status: 'pendiente' | 'aprobado' | 'cancelado'): Observable<Reservation> {
    return this.httpClient.patch<Reservation>(
      `${this.RESERVATION_URL}${reservationId}/status`,
      { status }
    );
  }

  deleteReservation(reservationId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.RESERVATION_URL}${reservationId}`);
  }
}
