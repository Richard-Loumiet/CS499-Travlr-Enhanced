import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';
import { Authentication } from '../services/authentication';
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-trip-card',
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard {
  @Input() trip!: Trip;

  private router = inject(Router);
  private authenticationService = inject(Authentication);
  private tripData = inject(TripData);

  public editTrip(trip: Trip): void {
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  public reserveTrip(trip: Trip): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['login']);
      return;
    }

    const guestInput = window.prompt(
      'How many guests are included in this reservation?',
      '1'
    );

    if (guestInput === null) {
      return;
    }

    const guestCount = Number(guestInput);

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      window.alert(
        'Guest count must be a whole number of at least 1.'
      );
      return;
    }

    this.tripData
      .createReservation(trip.code, guestCount)
      .subscribe({
        next: () => {
          window.alert('Reservation created successfully.');
          this.router.navigate(['reservations']);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
          window.alert('Unable to create reservation.');
        }
      });
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public isAdmin(): boolean {
    return this.authenticationService.isAdmin();
  }
}