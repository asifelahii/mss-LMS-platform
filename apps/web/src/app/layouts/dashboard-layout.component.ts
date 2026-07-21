import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { AuthStateService, SupabaseAuthService } from '@mss-platform/auth';

@Component({
  selector: 'mss-dashboard-layout',
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="mss-dashboard-shell">
      <aside class="mss-dashboard-sidebar">
        <a routerLink="/" class="mss-dashboard-brand" aria-label="MSS home">
          <img src="/brand/mss-logo-square-64.png" alt="MSS" class="mss-dashboard-logo" />
          <span>MSS</span>
        </a>

        <div class="mss-dashboard-user">
          <span>Signed in as</span>
          <strong>{{ displayName() }}</strong>
          <small>{{ roleLabel() }}</small>
        </div>

        <nav class="mss-dashboard-nav" aria-label="Dashboard navigation">
          <a routerLink="/student">Student</a>
          <a routerLink="/teacher">Teacher</a>
          <a routerLink="/admin">Admin</a>
          <a routerLink="/courses">Courses</a>
          <a routerLink="/packages">Packages</a>
        </nav>

        <button type="button" class="mss-dashboard-logout" (click)="logout()" [disabled]="isLoggingOut()">
          {{ isLoggingOut() ? 'Logging out...' : 'Logout' }}
        </button>

        @if (message()) {
          <p class="mss-dashboard-message">{{ message() }}</p>
        }
      </aside>

      <section class="mss-dashboard-content">
        <router-outlet />
      </section>
    </div>
  `,
})
export class DashboardLayoutComponent {
  private readonly authState = inject(AuthStateService);
  private readonly authService = inject(SupabaseAuthService);
  private readonly router = inject(Router);

  protected readonly isLoggingOut = signal(false);
  protected readonly message = signal('');

  protected readonly displayName = computed(
    () => this.authState.currentProfile()?.fullName ?? 'MSS User'
  );

  protected readonly roleLabel = computed(() => {
    const role = this.authState.currentRole();

    if (!role) {
      return 'No active role';
    }

    return role.replace(/_/g, ' ');
  });

  protected async logout(): Promise<void> {
    this.message.set('');
    this.isLoggingOut.set(true);

    try {
      await this.authService.logout();
      await this.router.navigateByUrl('/login');
    } catch (error) {
      this.message.set(error instanceof Error ? error.message : 'Logout failed. Please try again.');
    } finally {
      this.isLoggingOut.set(false);
    }
  }
}

