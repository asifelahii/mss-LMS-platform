import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mss-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="mss-auth-page">
      <div class="mss-auth-grid">
        <aside class="mss-auth-intro">
          <p class="mss-eyebrow">Start learning</p>
          <h2>Create your MSS student account.</h2>
          <p>
            MSS accounts are designed for real coaching operations: enrollment,
            payment approval, protected lessons, notes, quizzes, and support.
          </p>

          <div class="mss-auth-highlights">
            <span>Bangla-first experience</span>
            <span>bKash/Nagad/Rocket payment flow</span>
            <span>Course and batch access</span>
          </div>
        </aside>

        <div class="mss-auth-card">
          <p class="mss-eyebrow">Register</p>
          <h2>Create account</h2>
          <p class="mss-muted-text">
            Student registration structure is ready. Backend connection will come next.
          </p>

          <form class="mss-form" [formGroup]="registerForm" (ngSubmit)="submit()">
            <label>
              Full name
              <input
                type="text"
                formControlName="fullName"
                placeholder="Your full name"
                autocomplete="name"
              />
            </label>

            <label>
              Phone number
              <input
                type="tel"
                formControlName="phone"
                placeholder="01XXXXXXXXX"
                autocomplete="tel"
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                formControlName="email"
                placeholder="student@example.com"
                autocomplete="email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                formControlName="password"
                placeholder="Minimum 6 characters"
                autocomplete="new-password"
              />
            </label>

            <label>
              Confirm password
              <input
                type="password"
                formControlName="confirmPassword"
                placeholder="Retype your password"
                autocomplete="new-password"
              />
            </label>

            <label class="mss-inline-check">
              <input type="checkbox" formControlName="acceptTerms" />
              I agree to follow MSS course access and account-sharing rules.
            </label>

            @if (message()) {
              <p class="mss-form-message">{{ message() }}</p>
            }

            <button class="mss-primary-button mss-full-button" type="submit">
              Create Account
            </button>
          </form>

          <p class="mss-auth-switch">
            Already have an account?
            <a routerLink="/login">Login</a>
          </p>
        </div>
      </div>
    </section>
  `,
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly message = signal('');

  protected readonly registerForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(11)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, [Validators.requiredTrue]],
  });

  protected submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.message.set('Please complete all required fields correctly.');
      return;
    }

    const { password, confirmPassword } = this.registerForm.getRawValue();

    if (password !== confirmPassword) {
      this.message.set('Password and confirm password do not match.');
      return;
    }

    this.message.set('Registration UI is ready. Supabase Auth will be connected next.');
  }
}
