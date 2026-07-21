import { inject, Injectable } from '@angular/core';

import { SupabaseClientService } from '@mss-platform/data-access';
import { UserProfile, UserRole } from '@mss-platform/models';

import { AuthStateService } from './auth-state.service';

interface ProfileRow {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  role: UserRole;
  status: 'pending' | 'active' | 'blocked';
  avatar_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegisterWithProfileInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface LoginWithPasswordInput {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {
  private readonly supabase = inject(SupabaseClientService);
  private readonly authState = inject(AuthStateService);

  async registerWithProfile(input: RegisterWithProfileInput): Promise<UserProfile> {
    const { data, error } = await this.supabase.client.auth.signUp({
      email: input.email,
      password: input.password,
    });

    if (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }

    const userId = data.user?.id;

    if (!userId) {
      throw new Error('Registration failed: Supabase did not return a user ID.');
    }

    const profile = await this.createProfile({
      id: userId,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      role: input.role ?? 'student',
    });

    this.authState.setProfile(profile);

    return profile;
  }

  async loginWithPassword(input: LoginWithPasswordInput): Promise<UserProfile> {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      throw new Error(`Login failed: ${error.message}`);
    }

    const userId = data.user?.id;

    if (!userId) {
      throw new Error('Login failed: Supabase did not return a user ID.');
    }

    const profile = await this.loadProfileByUserId(userId);

    this.authState.setProfile(profile);

    return profile;
  }

  async loadCurrentProfile(): Promise<UserProfile | null> {
    const { data, error } = await this.supabase.client.auth.getUser();

    if (error) {
      this.authState.clearProfile();
      return null;
    }

    const userId = data.user?.id;

    if (!userId) {
      this.authState.clearProfile();
      return null;
    }

    const profile = await this.loadProfileByUserId(userId);

    this.authState.setProfile(profile);

    return profile;
  }

  async logout(): Promise<void> {
    const { error } = await this.supabase.client.auth.signOut();

    if (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }

    this.authState.clearProfile();
  }

  private async createProfile(input: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: UserRole;
  }): Promise<UserProfile> {
    const { data, error } = await this.supabase.client
      .from('profiles')
      .insert({
        id: input.id,
        full_name: input.fullName,
        phone: input.phone ?? null,
        email: input.email,
        role: input.role,
        status: 'active',
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Profile creation failed: ${error.message}`);
    }

    return this.mapProfileRow(data as ProfileRow);
  }

  private async loadProfileByUserId(userId: string): Promise<UserProfile> {
    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Profile loading failed: ${error.message}`);
    }

    return this.mapProfileRow(data as ProfileRow);
  }

  private mapProfileRow(row: ProfileRow): UserProfile {
    return {
      id: row.id,
      fullName: row.full_name,
      phone: row.phone ?? undefined,
      email: row.email ?? undefined,
      role: row.role,
      status: row.status,
      avatarPath: row.avatar_path ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    } as UserProfile;
  }
}
