import { InjectionToken } from '@angular/core';

export interface AuthGuardConfig {
  enableRouteGuards: boolean;
}

export const AUTH_GUARD_CONFIG = new InjectionToken<AuthGuardConfig>(
  'AUTH_GUARD_CONFIG',
  {
    factory: () => ({
      enableRouteGuards: true,
    }),
  }
);
