import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mss-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="mss-auth-page">
      <div class="mss-auth-grid">
        <aside class="mss-auth-intro">
          <p class="mss-eyebrow">Welcome back</p>
          <h2>Continue your learning journey with MSS.</h2>
          <p>
            Access your enrolled courses, lesson progress, payment status,
            materials, quizzes, and support from one secure dashboard.
          </p>

          <div class="mss-auth-highlights">
            <span>Protected course access</span>
            <span>Progress tracking</span>
            <span>Teacher-guided learning</span>
          </div>
        </aside>

        <div class="mss-auth-card">
          <p class="mss-eyebrow">Login</p>
          <h2>Login to your account</h2>
          <p class="mss-muted-text">
            Supabase Auth will be connected later. For now, this is the production UI skeleton.
          </p>

          <form class="mss-form" [formGroup]="loginForm" (ngSubmit)="submit()">
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
                placeholder="Enter your password"
                autocomplete="current-password"
              />
            </label>

            <div class="mss-form-row">
              <label class="mss-inline-check">
                <input type="checkbox" formControlName="rememberMe" />
                Remember me
              </label>

              <a routerLink="/forgot-password" class="mss-text-link">Forgot password?</a>
            </div>

            @if (message()) {
              <p class="mss-form-message">{{ message() }}</p>
            }

            <button class="mss-primary-button mss-full-button" type="submit">
              Login
            </button>
          </form>

          <p class="mss-auth-switch">
            New to MSS?
            <a routerLink="/register">Create an account</a>
          </p>
        </div>
      </div>
    </section>
  `,
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly message = signal('');

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [true],
  });

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.message.set('Please enter a valid email and password.');
      return;
    }

    this.message.set('Login UI is ready. Supabase Auth will be connected next.');
  }
}
