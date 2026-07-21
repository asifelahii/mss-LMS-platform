import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SupabaseAuthService } from '@mss-platform/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authService = inject(SupabaseAuthService);

  constructor() {
    void this.authService.loadCurrentProfile().catch(() => {
      // Supabase may be unconfigured during local UI development.
      // Route guards and auth pages will show readable errors when needed.
    });
  }
}
