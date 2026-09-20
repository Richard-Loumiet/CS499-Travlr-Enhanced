import { Service, inject } from '@angular/core';

import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from './trip-data';

@Service()
export class Authentication {
  private storage = inject(BROWSER_STORAGE);
  private tripDataService = inject(TripData);

  authResp: AuthResponse = new AuthResponse();

  // Get our token from our Storage provider.
  // The key for our token is 'travlr-token'
  public getToken(): string {
    const out = this.storage.getItem('travlr-token');

    if (!out) {
      return '';
    }

    return out;
  }

  // Save our token to our Storage provider.
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Logout and remove the JWT from Storage.
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  // Determine whether a token exists and is still valid.
  public isLoggedIn(): boolean {
    const token: string = this.getToken();

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    }

    return false;
  }

  // Retrieve the current user from the JWT.
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));

    return { email, name } as User;
  }

  // Login through TripData and save the returned JWT.
  public login(user: User, passwd: string): void {
    this.tripDataService.login(user, passwd)
      .subscribe({
        next: (value: AuthResponse) => {
          if (value) {
            console.log(value);
            this.authResp = value;
            this.saveToken(this.authResp.token);
          }
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }

  // Register through TripData and save the returned JWT.
  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd)
      .subscribe({
        next: (value: AuthResponse) => {
          if (value) {
            console.log(value);
            this.authResp = value;
            this.saveToken(this.authResp.token);
          }
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }
}