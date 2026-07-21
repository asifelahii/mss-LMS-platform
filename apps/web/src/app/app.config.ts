import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

import { AUTH_GUARD_CONFIG } from '../../../../libs/auth/src/lib/config/auth-guard.config';
import { SUPABASE_CONFIG } from '../../../../libs/data-access/src/lib/supabase/supabase-config.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),
    {
      provide: SUPABASE_CONFIG,
      useValue: environment.supabase,
    },
    {
      provide: AUTH_GUARD_CONFIG,
      useValue: environment.auth,
    },
  ],
};
