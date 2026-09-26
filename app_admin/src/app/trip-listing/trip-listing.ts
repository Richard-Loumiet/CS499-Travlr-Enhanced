import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';
import { TripCard } from '../trip-card/trip-card';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-listing',
  imports: [CommonModule, FormsModule, TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
})
export class TripListing implements OnInit {
  // Complete set of trips returned from the database.
  allTrips: Trip[] = [];

  // Trips currently displayed after search, filter, and sort operations.
  trips: Trip[] = [];

  message = '';

  searchTerm = '';
  selectedResort = '';
  sortOption = 'default';

  resorts: string[] = [];

  private tripData = inject(TripData);
  private changeDetector = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authenticationService = inject(Authentication);

  ngOnInit(): void {
    this.getTrips();
  }

  private getTrips(): void {
    this.tripData.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.allTrips = value;
        this.trips = value;

        // Build a unique list of resorts for the filter control.
        this.resorts = [
          ...new Set(
            value
              .map((trip: Trip) => trip.resort)
              .filter((resort: string) => resort)
          )
        ].sort((a: string, b: string) => a.localeCompare(b));

        if (value.length > 0) {
          this.message = 'There are ' + value.length + ' trips available.';
        } else {
          this.message = 'There were no trips retrieved from the database.';
        }

        console.log(this.message);
        this.changeDetector.markForCheck();
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    });
  }

  public applyFiltersAndSort(): void {
    const search = this.searchTerm.trim().toLowerCase();

    // Linear search and filter through the available trips.
    let results = this.allTrips.filter((trip: Trip) => {
      const matchesSearch =
        !search ||
        trip.code.toLowerCase().includes(search) ||
        trip.name.toLowerCase().includes(search) ||
        trip.resort.toLowerCase().includes(search) ||
        trip.description.toLowerCase().includes(search);

      const matchesResort =
        !this.selectedResort ||
        trip.resort === this.selectedResort;

      return matchesSearch && matchesResort;
    });

    // Sort a copy of the filtered results based on the selected option.
    results = [...results];

    switch (this.sortOption) {
      case 'name-asc':
        results.sort((a: Trip, b: Trip) =>
          a.name.localeCompare(b.name)
        );
        break;

      case 'name-desc':
        results.sort((a: Trip, b: Trip) =>
          b.name.localeCompare(a.name)
        );
        break;

      case 'price-low':
        results.sort(
          (a: Trip, b: Trip) =>
            this.getPriceValue(a.perPerson) -
            this.getPriceValue(b.perPerson)
        );
        break;

      case 'price-high':
        results.sort(
          (a: Trip, b: Trip) =>
            this.getPriceValue(b.perPerson) -
            this.getPriceValue(a.perPerson)
        );
        break;

      case 'date-asc':
        results.sort(
          (a: Trip, b: Trip) =>
            new Date(a.start).getTime() -
            new Date(b.start).getTime()
        );
        break;

      case 'date-desc':
        results.sort(
          (a: Trip, b: Trip) =>
            new Date(b.start).getTime() -
            new Date(a.start).getTime()
        );
        break;
    }

    this.trips = results;

    if (results.length === 1) {
      this.message = '1 trip matches the current search and filters.';
    } else {
      this.message =
        results.length +
        ' trips match the current search and filters.';
    }

    this.changeDetector.markForCheck();
  }

  // Convert the stored price string into a number for numeric sorting.
  private getPriceValue(price: string): number {
    const value = Number(price.replace(/[^0-9.-]+/g, ''));

    return Number.isNaN(value) ? 0 : value;
  }

  public clearFilters(): void {
    this.searchTerm = '';
    this.selectedResort = '';
    this.sortOption = 'default';
    this.applyFiltersAndSort();
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public isAdmin(): boolean {
    return this.authenticationService.isAdmin();
  }
}