@'

## Sprint 8B-2 Completed

- [x] Refactored layout components into component-named folders
- [x] Split PublicLayoutComponent into TS, HTML, and SCSS files
- [x] Split DashboardLayoutComponent into TS, HTML, and SCSS files
- [x] Updated route lazy imports to the new component paths
- [x] Removed old flat inline-template layout component files

## Sprint 8B-2 Convention

For maintainability, MSS components should follow this structure:

component-name/
- component-name.component.ts
- component-name.component.html
- component-name.component.scss
- component-name.component.spec.ts, optional

Inline templates should be avoided except for very small temporary components.
'@ | Add-Content "docs\sprints\sprint-08-professional-ui-polish.md"import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { AuthStateService, SupabaseAuthService } from '@mss-platform/auth';

interface DashboardNavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'mss-dashboard-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
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

  protected readonly dashboardLinks = computed<DashboardNavLink[]>(() => {
    const role = this.authState.currentRole();

    if (role === 'teacher') {
      return [
        { label: 'Teacher Dashboard', href: '/teacher' },
        { label: 'Courses', href: '/courses' },
        { label: 'Packages', href: '/packages' },
      ];
    }

    if (role === 'admin' || role === 'super_admin' || role === 'support') {
      return [
        { label: 'Admin Dashboard', href: '/admin' },
        { label: 'Courses', href: '/courses' },
        { label: 'Packages', href: '/packages' },
      ];
    }

    if (role === 'student') {
      return [
        { label: 'Student Dashboard', href: '/student' },
        { label: 'Courses', href: '/courses' },
        { label: 'Packages', href: '/packages' },
      ];
    }

    return [
      { label: 'Student Dashboard', href: '/student' },
      { label: 'Teacher Dashboard', href: '/teacher' },
      { label: 'Admin Dashboard', href: '/admin' },
      { label: 'Courses', href: '/courses' },
      { label: 'Packages', href: '/packages' },
    ];
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
