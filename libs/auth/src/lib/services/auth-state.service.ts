import { computed, Injectable, signal } from '@angular/core';

import { UserProfile, UserRole } from '@mss-platform/models';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly currentProfileState = signal<UserProfile | null>(null);

  readonly currentProfile = computed(() => this.currentProfileState());
  readonly isAuthenticated = computed(() => Boolean(this.currentProfileState()));
  readonly currentRole = computed(() => this.currentProfileState()?.role ?? null);

  setProfile(profile: UserProfile | null): void {
    this.currentProfileState.set(profile);
  }

  clearProfile(): void {
    this.currentProfileState.set(null);
  }

  hasAnyRole(allowedRoles: UserRole[]): boolean {
    const role = this.currentRole();

    if (!role) {
      return false;
    }

    return allowedRoles.includes(role);
  }
}
