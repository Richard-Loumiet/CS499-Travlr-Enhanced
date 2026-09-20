import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public formError: string = '';
  submitted = false;

  credentials = {
    name: '',
    email: '',
    password: ''
  };

  private router = inject(Router);
  private authenticationService = inject(Authentication);

  public onLoginSubmit(): void {
    this.formError = '';

    if (
      !this.credentials.email ||
      !this.credentials.password
    ) {
      this.formError = 'Email and password are required, please try again';
      return;
    }

    this.doLogin();
  }

  private doLogin(): void {
    const newUser = new User();
    newUser.email = this.credentials.email;
    newUser.name = this.credentials.name || '';

    this.authenticationService.login(
      newUser,
      this.credentials.password
    ).subscribe({
      next: () => {
        if (this.authenticationService.isLoggedIn()) {
          this.router.navigate(['']);
        } else {
          this.formError = 'Login failed. Please try again.';
        }
      },
      error: () => {
        this.formError =
          'Login failed. Please check your email and password.';
      }
    });
  }
}