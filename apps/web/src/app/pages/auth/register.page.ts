import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SupabaseAuthService } from '@mss-platform/auth';

@Component({
  selector: 'mss-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="mss-auth-grid">
      <div class="mss-auth-intro">
        <p class="mss-eyebrow">Student Registration</p>
        <h1>Create your MSS student account.</h1>
        <p>
          Registration will create a Supabase Auth user and a matching MSS profile.
          Course enrollment and payment approval will happen after account creation.
        </p>

        <div class="mss-auth-highlights">
          <span>Course access after approval</span>
          <span>Manual MFS verification</span>
          <span>Protected student dashboard</span>
        </div>
      </div>

      <form class="mss-auth-card mss-form" [formGroup]="registerForm" (ngSubmit)="submitRegister()">
        <div>
          <p class="mss-eyebrow">Join MSS</p>
          <h2>Create account</h2>
          <p class="mss-muted-text">Start with your basic student information.</p>
        </div>

        <label>
          Full name
          <input formControlName="fullName" type="text" placeholder="Enter your full name" />
        </label>

        <label>
          Phone
          <input formControlName="phone" type="tel" placeholder="01XXXXXXXXX" />
        </label>

        <label>
          Email
          <input formControlName="email" type="email" placeholder="you@example.com" />
        </label>

        <div class="mss-form-row">
          <label>
            Password
            <input formControlName="password" type="password" placeholder="Create password" />
          </label>

          <label>
            Confirm password
            <input formControlName="confirmPassword" type="password" placeholder="Confirm password" />
          </label>
        </div>

        <label class="mss-inline-check">
          <input formControlName="acceptTerms" type="checkbox" />
          <span>I confirm that the information is correct.</span>
        </label>

        @if (message()) {
          <p class="mss-form-message">{{ message() }}</p>
        }

        <button type="submit" class="mss-primary-button mss-full-button" [disabled]="isSubmitting()">
          {{ isSubmitting() ? 'Creating account...' : 'Create Account' }}
        </button>

        <p class="mss-auth-switch">
          Already have an account?
          <a routerLink="/login">Login</a>
        </p>
      </form>
    </section>
  `,
})
export class RegisterPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(SupabaseAuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly message = signal('');

  protected readonly registerForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, [Validators.requiredTrue]],
  });

  protected async submitRegister(): Promise<void> {
    this.message.set('');

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.message.set('Please complete all required registration fields.');
      return;
    }

    const formValue = this.registerForm.getRawValue();

    if (formValue.password !== formValue.confirmPassword) {
      this.message.set('Password and confirm password do not match.');
      return;
    }

    this.isSubmitting.set(true);

    try {
      await this.authService.registerWithProfile({
        fullName: formValue.fullName,
        phone: formValue.phone,
        email: formValue.email,
        password: formValue.password,
        role: 'student',
      });

      await this.router.navigateByUrl('/student');
    } catch (error) {
      this.message.set(this.getReadableError(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private getReadableError(error: unknown): string {
    return error instanceof Error ? error.message : 'Registration failed. Please try again.';
  }
}
