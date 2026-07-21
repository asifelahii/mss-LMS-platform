import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SupabaseAuthService } from '@mss-platform/auth';
import { UserRole } from '@mss-platform/models';

@Component({
  selector: 'mss-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="mss-auth-grid">
      <div class="mss-auth-intro">
        <p class="mss-eyebrow">Student Login</p>
        <h1>Continue your MSS learning journey.</h1>
        <p>
          Login will connect to Supabase Auth. After login, MSS will load your profile,
          detect your role, and redirect you to the correct dashboard.
        </p>

        <div class="mss-auth-highlights">
          <span>Student dashboard</span>
          <span>Teacher dashboard</span>
          <span>Admin approval workflow</span>
        </div>
      </div>

      <form class="mss-auth-card mss-form" [formGroup]="loginForm" (ngSubmit)="submitLogin()">
        <div>
          <p class="mss-eyebrow">Welcome back</p>
          <h2>Login to MSS</h2>
          <p class="mss-muted-text">Use your registered email and password.</p>
        </div>

        <label>
          Email
          <input formControlName="email" type="email" placeholder="you@example.com" />
        </label>

        <label>
          Password
          <input formControlName="password" type="password" placeholder="Enter your password" />
        </label>

        @if (message()) {
          <p class="mss-form-message">{{ message() }}</p>
        }

        <button type="submit" class="mss-primary-button mss-full-button" [disabled]="isSubmitting()">
          {{ isSubmitting() ? 'Logging in...' : 'Login' }}
        </button>

        <p class="mss-auth-switch">
          New to MSS?
          <a routerLink="/register">Create an account</a>
        </p>
      </form>
    </section>
  `,
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(SupabaseAuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly message = signal('');

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected async submitLogin(): Promise<void> {
    this.message.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.message.set('Please enter a valid email and password.');
      return;
    }

    this.isSubmitting.set(true);

    try {
      const profile = await this.authService.loginWithPassword(this.loginForm.getRawValue());
      await this.router.navigateByUrl(this.getRoleRedirect(profile.role));
    } catch (error) {
      this.message.set(this.getReadableError(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private getRoleRedirect(role: UserRole): string {
    if (role === 'teacher') {
      return '/teacher';
    }

    if (role === 'admin' || role === 'super_admin' || role === 'support') {
      return '/admin';
    }

    return '/student';
  }

  private getReadableError(error: unknown): string {
    return error instanceof Error ? error.message : 'Login failed. Please try again.';
  }
}
