import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserRole } from '@mss-platform/models';

import { AUTH_GUARD_CONFIG } from '../config/auth-guard.config';
import { AuthStateService } from '../services/auth-state.service';
import { SupabaseAuthService } from '../services/supabase-auth.service';
import { getRoleRedirectPath } from '../utils/role-redirect.util';

async function resolveCurrentRole(): Promise<UserRole | null> {
  const authState = inject(AuthStateService);

  if (authState.currentRole()) {
    return authState.currentRole();
  }

  try {
    const authService = inject(SupabaseAuthService);
    const profile = await authService.loadCurrentProfile();

    return profile?.role ?? null;
  } catch {
    authState.clearProfile();
    return null;
  }
}

export const authGuard: CanActivateFn = async () => {
  const config = inject(AUTH_GUARD_CONFIG);
  const router = inject(Router);

  if (!config.enableRouteGuards) {
    return true;
  }

  const role = await resolveCurrentRole();

  return role ? true : router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = async () => {
  const config = inject(AUTH_GUARD_CONFIG);
  const router = inject(Router);

  if (!config.enableRouteGuards) {
    return true;
  }

  const role = await resolveCurrentRole();

  return role ? router.createUrlTree([getRoleRedirectPath(role)]) : true;
};

export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return async () => {
    const config = inject(AUTH_GUARD_CONFIG);
    const router = inject(Router);

    if (!config.enableRouteGuards) {
      return true;
    }

    const role = await resolveCurrentRole();

    if (!role) {
      return router.createUrlTree(['/login']);
    }

    if (allowedRoles.includes(role)) {
      return true;
    }

    return router.createUrlTree([getRoleRedirectPath(role)]);
  };
}
