import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Reservation } from '../models/reservation';
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-reservations',
  imports: [CommonModule],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css',
})
export class Reservations implements OnInit {
  reservations: Reservation[] = [];
  message = '';

  private tripData = inject(TripData);
  private changeDetector = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.getReservations();
  }

  private getReservations(): void {
    this.tripData.getReservations().subscribe({
      next: (value: Reservation[]) => {
        this.reservations = value;

        if (value.length > 0) {
          this.message =
            'You have ' + value.length + ' reservation(s).';
        } else {
          this.message = 'You do not have any reservations.';
        }

        this.changeDetector.markForCheck();
      },
      error: (error: any) => {
        console.log('Error: ' + error);
        this.message = 'Unable to retrieve reservations.';
        this.changeDetector.markForCheck();
      }
    });
  }
}