import { computed, Injectable, signal } from '@angular/core';

import { UserProfile, UserRole } from '@mss-platform/models';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly profileSignal = signal<UserProfile | null>(null);

  readonly currentProfile = this.profileSignal.asReadonly();

  readonly isAuthenticated = computed(() => this.profileSignal() !== null);

  readonly currentRole = computed<UserRole | null>(() => this.profileSignal()?.role ?? null);

  setProfile(profile: UserProfile): void {
    this.profileSignal.set(profile);
  }

  clearProfile(): void {
    this.profileSignal.set(null);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const role = this.currentRole();

    return role !== null && roles.includes(role);
  }
}
