export interface ReservationTrip {
  _id: string;
  code: string;
  name: string;
  resort: string;
  start: Date;
  perPerson: string;
}

export interface ReservationUser {
  _id: string;
  name: string;
  email: string;
}

export interface Reservation {
  _id: string;
  user: string | ReservationUser;
  trip: ReservationTrip;
  guestCount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}