export interface Reservation {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  clientId: {
    _id: string;
    name: string;
    clientType: 'Restaurante' | 'Hotel' | 'Otro';
    location: {
      address: string;
      coordinates: number[];
    };
  };
  reservationDate: string;
  status: 'pendiente' | 'aprobado' | 'cancelado';
  paymentInfo: {
    amount: number;
    method: 'tarjeta' | 'efectivo' | 'movil';
    paymentDate: string;
  };
}