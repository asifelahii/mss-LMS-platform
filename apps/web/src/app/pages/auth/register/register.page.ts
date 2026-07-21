import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SupabaseAuthService } from '@mss-platform/auth';

@Component({
  selector: 'mss-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
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
