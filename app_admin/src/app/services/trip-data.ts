import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Service()
export class TripData {
  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:3000/api';

  public getTrips(): Observable<Trip[]> {
    const url = `${this.baseUrl}/trips`;
    return this.http.get<Trip[]>(url);
  }

  public getTrip(tripCode: string): Observable<Trip[]> {
    const url = `${this.baseUrl}/trips/${tripCode}`;
    return this.http.get<Trip[]>(url);
  }

  public addTrip(trip: Trip): Observable<Trip> {
    const url = `${this.baseUrl}/trips`;
    return this.http.post<Trip>(url, trip);
  }

  public updateTrip(trip: Trip): Observable<Trip> {
    const url = `${this.baseUrl}/trips/${trip.code}`;
    return this.http.put<Trip>(url, trip);
  }

  // Call to our /login endpoint, returns JWT
  public login(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, passwd);
  }

  // Call to our /register endpoint, creates user and returns JWT
  public register(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, passwd);
  }

  // Helper method to process both login and register methods
  private handleAuthAPICall(
    endpoint: string,
    user: User,
    passwd: string
  ): Observable<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };

    return this.http.post<AuthResponse>(
      `${this.baseUrl}/${endpoint}`,
      formData
    );
  }
}