import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { AUTH_GUARD_CONFIG } from '@mss-platform/auth';
import { SUPABASE_CONFIG } from '@mss-platform/data-access';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

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
