import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { getRoleRedirectPath, SupabaseAuthService } from '@mss-platform/auth';

@Component({
  selector: 'mss-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
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
      await this.router.navigateByUrl(getRoleRedirectPath(profile.role));
    } catch (error) {
      this.message.set(this.getReadableError(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private getReadableError(error: unknown): string {
    return error instanceof Error ? error.message : 'Login failed. Please try again.';
  }
}
