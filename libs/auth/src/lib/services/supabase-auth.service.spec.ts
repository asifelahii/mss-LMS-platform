import { TestBed } from '@angular/core/testing';

import { SupabaseClientService } from '@mss-platform/data-access';

import { AuthStateService } from './auth-state.service';
import { SupabaseAuthService } from './supabase-auth.service';

describe('SupabaseAuthService', () => {
  function createProfileRow() {
    return {
      id: 'user-1',
      full_name: 'Test Student',
      phone: '01700000000',
      email: 'student@mss.test',
      role: 'student',
      status: 'active',
      avatar_path: null,
      created_at: '2026-07-18T00:00:00Z',
      updated_at: '2026-07-18T00:00:00Z',
    };
  }

  function setup(options?: {
    signUpError?: { message: string } | null;
    signInError?: { message: string } | null;
    signOutError?: { message: string } | null;
    getUserError?: { message: string } | null;
    profileError?: { message: string } | null;
    userId?: string | null;
  }) {
    const profileRow = createProfileRow();

    const single = jest.fn().mockResolvedValue({
      data: options?.profileError ? null : profileRow,
      error: options?.profileError ?? null,
    });

    const eq = jest.fn(() => ({ single }));
    const selectAfterRead = jest.fn(() => ({ eq }));

    const selectAfterInsert = jest.fn(() => ({ single }));
    const insert = jest.fn(() => ({ select: selectAfterInsert }));

    const from = jest.fn(() => ({
      insert,
      select: selectAfterRead,
    }));

    const auth = {
      signUp: jest.fn().mockResolvedValue({
        data: {
          user: options?.userId === null ? null : { id: options?.userId ?? 'user-1' },
        },
        error: options?.signUpError ?? null,
      }),
      signInWithPassword: jest.fn().mockResolvedValue({
        data: {
          user: options?.userId === null ? null : { id: options?.userId ?? 'user-1' },
        },
        error: options?.signInError ?? null,
      }),
      getUser: jest.fn().mockResolvedValue({
        data: {
          user: options?.userId === null ? null : { id: options?.userId ?? 'user-1' },
        },
        error: options?.getUserError ?? null,
      }),
      signOut: jest.fn().mockResolvedValue({
        error: options?.signOutError ?? null,
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        SupabaseAuthService,
        AuthStateService,
        {
          provide: SupabaseClientService,
          useValue: {
            client: {
              auth,
              from,
            },
          },
        },
      ],
    });

    return {
      service: TestBed.inject(SupabaseAuthService),
      authState: TestBed.inject(AuthStateService),
      auth,
      from,
      insert,
      eq,
    };
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('registers a user, creates profile, and updates auth state', async () => {
    const { service, authState, auth, from, insert } = setup();

    const profile = await service.registerWithProfile({
      fullName: 'Test Student',
      email: 'student@mss.test',
      password: 'Password123!',
      phone: '01700000000',
    });

    expect(auth.signUp).toHaveBeenCalledWith({
      email: 'student@mss.test',
      password: 'Password123!',
    });

    expect(from).toHaveBeenCalledWith('profiles');
    expect(insert).toHaveBeenCalledWith({
      id: 'user-1',
      full_name: 'Test Student',
      phone: '01700000000',
      email: 'student@mss.test',
      role: 'student',
      status: 'active',
    });

    expect(profile.id).toBe('user-1');
    expect(authState.currentProfile()?.id).toBe('user-1');
  });

  it('logs in a user and loads profile', async () => {
    const { service, authState, auth, eq } = setup();

    const profile = await service.loginWithPassword({
      email: 'student@mss.test',
      password: 'Password123!',
    });

    expect(auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'student@mss.test',
      password: 'Password123!',
    });

    expect(eq).toHaveBeenCalledWith('id', 'user-1');
    expect(profile.role).toBe('student');
    expect(authState.isAuthenticated()).toBe(true);
  });

  it('loads current profile when Supabase returns a user', async () => {
    const { service, authState } = setup();

    const profile = await service.loadCurrentProfile();

    expect(profile?.id).toBe('user-1');
    expect(authState.currentRole()).toBe('student');
  });

  it('clears auth state when no current user exists', async () => {
    const { service, authState } = setup({ userId: null });

    const profile = await service.loadCurrentProfile();

    expect(profile).toBeNull();
    expect(authState.isAuthenticated()).toBe(false);
  });

  it('logs out and clears auth state', async () => {
    const { service, authState } = setup();

    await service.loginWithPassword({
      email: 'student@mss.test',
      password: 'Password123!',
    });

    expect(authState.isAuthenticated()).toBe(true);

    await service.logout();

    expect(authState.isAuthenticated()).toBe(false);
  });

  it('throws readable registration errors', async () => {
    const { service } = setup({
      signUpError: { message: 'email already registered' },
    });

    await expect(
      service.registerWithProfile({
        fullName: 'Test Student',
        email: 'student@mss.test',
        password: 'Password123!',
      })
    ).rejects.toThrow('Registration failed: email already registered');
  });

  it('throws readable profile creation errors', async () => {
    const { service } = setup({
      profileError: { message: 'RLS blocked profile insert' },
    });

    await expect(
      service.registerWithProfile({
        fullName: 'Test Student',
        email: 'student@mss.test',
        password: 'Password123!',
      })
    ).rejects.toThrow('Profile creation failed: RLS blocked profile insert');
  });
});
