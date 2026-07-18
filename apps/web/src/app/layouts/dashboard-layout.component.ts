import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'mss-dashboard-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="mss-dashboard-shell">
      <aside class="mss-sidebar">
        <a routerLink="/" class="mss-dashboard-brand" aria-label="MSS - Math and Science Seekers home">
          <img
            src="/brand/mss-logo-square-64.png"
            alt="MSS"
            class="mss-dashboard-logo"
          />
          <span>
            <strong>MSS</strong>
            <small>{{ portalTitle() }}</small>
          </span>
        </a>

        <nav class="mss-sidebar-nav" aria-label="Dashboard navigation">
          <a [routerLink]="basePath()" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            Dashboard
          </a>
          <a [routerLink]="basePath() + '/courses'" routerLinkActive="active">Courses</a>
          <a [routerLink]="basePath() + '/support'" routerLinkActive="active">Support</a>
          <a [routerLink]="basePath() + '/profile'" routerLinkActive="active">Profile</a>
        </nav>
      </aside>

      <section class="mss-dashboard-main">
        <header class="mss-dashboard-topbar">
          <div>
            <p class="mss-eyebrow">Sprint 1 Skeleton</p>
            <h1>{{ portalTitle() }}</h1>
          </div>
          <a routerLink="/" class="mss-text-link">Back to site</a>
        </header>

        <router-outlet />
      </section>
    </div>
  `,
})
export class DashboardLayoutComponent {
  private readonly route = inject(ActivatedRoute);

  protected portal(): string {
    return String(this.route.snapshot.data['portal'] ?? 'dashboard');
  }

  protected basePath(): string {
    return `/${this.portal()}`;
  }

  protected portalTitle(): string {
    const portal = this.portal();

    if (portal === 'student') {
      return 'Student Portal';
    }

    if (portal === 'teacher') {
      return 'Teacher Dashboard';
    }

    if (portal === 'admin') {
      return 'Admin Dashboard';
    }

    return 'Dashboard';
  }
}
