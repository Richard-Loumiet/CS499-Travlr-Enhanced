import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Authentication } from '../services/authentication';

export const adminGuard: CanActivateFn = () => {
  const authenticationService = inject(Authentication);
  const router = inject(Router);

  // User is not logged in, send them to the login page.
  if (!authenticationService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  // User is logged in but does not have the admin role.
  if (!authenticationService.isAdmin()) {
    return router.createUrlTree(['/']);
  }

  // Authenticated administrator can continue.
  return true;
};