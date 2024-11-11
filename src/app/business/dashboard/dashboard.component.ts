import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../core/services/reservation.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reservation } from '../../models/Reservation';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  reservations: Reservation[] = [];
  clientId: string | null = null;
  statusOptions = ['pendiente', 'aprobado', 'cancelado'] as const;
  isLoading = false;
  error: string | null = null;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.clientId = this.authService.getCliendIdFromToken();
    console.log(this.clientId);
    if (this.clientId) {
      this.fetchReservations();
    } else {
      this.error = "No se encontró ID del negocio";
    }
  }

  fetchReservations(): void {
    if (!this.clientId) return;
    
    this.isLoading = true;
    this.error = null;
    
    this.reservationService.getReservationByClientId(this.clientId).subscribe({
      next: (data) => {
        this.reservations = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Error al cargar las reservas: " + err.message;
        this.isLoading = false;
      }
    });
  }

  updateStatus(reservationId: string, newStatus: 'pendiente' | 'aprobado' | 'cancelado'): void {
    this.reservationService.updateReservationStatus(reservationId, newStatus).subscribe({
      next: (updatedReservation) => {
        const index = this.reservations.findIndex(r => r._id === reservationId);
        if (index !== -1) {
          this.reservations[index] = updatedReservation;
        }
      },
      error: (err) => {
        this.error = "Error al actualizar el estado: " + err.message;
      }
    });
  }

  deleteReservation(reservationId: string): void {
    if (confirm('¿Está seguro de eliminar esta reserva?')) {
      this.reservationService.deleteReservation(reservationId).subscribe({
        next: () => {
          this.reservations = this.reservations.filter(r => r._id !== reservationId);
        },
        error: (err) => {
          this.error = "Error al eliminar la reserva: " + err.message;
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'PEN'
    });
  }

  getStatusClass(status: string): string {
    return {
      'pendiente': 'status-pending',
      'aprobado': 'status-approved',
      'cancelado': 'status-cancelled'
    }[status] || '';
  }

}