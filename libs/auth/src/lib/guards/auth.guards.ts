import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserRole } from '@mss-platform/models';

import { AUTH_GUARD_CONFIG } from '../config/auth-guard.config';
import { AuthStateService } from '../services/auth-state.service';
import { getDefaultRouteForRole } from '../utils/role-redirect.util';

export const authGuard: CanActivateFn = () => {
  const config = inject(AUTH_GUARD_CONFIG);
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (!config.enableRouteGuards) {
    return true;
  }

  if (authState.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
  const config = inject(AUTH_GUARD_CONFIG);
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (!config.enableRouteGuards) {
    return true;
  }

  if (!authState.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([getDefaultRouteForRole(authState.currentRole())]);
};

export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return () => {
    const config = inject(AUTH_GUARD_CONFIG);
    const authState = inject(AuthStateService);
    const router = inject(Router);

    if (!config.enableRouteGuards) {
      return true;
    }

    if (!authState.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    if (authState.hasAnyRole(allowedRoles)) {
      return true;
    }

    return router.createUrlTree([getDefaultRouteForRole(authState.currentRole())]);
  };
}
