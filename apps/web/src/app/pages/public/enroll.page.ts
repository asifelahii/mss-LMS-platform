import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { COURSE_CATALOG_ITEMS } from '../../data/course-catalog.data';
import { COURSE_PACKAGES } from '../../data/course-packages.data';

@Component({
  selector: 'mss-enroll-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="mss-enroll-hero">
      <div>
        <p class="mss-eyebrow">Enrollment</p>
        <h1>Submit your course enrollment request.</h1>
        <p>
          This is the public enrollment skeleton for MSS. Later, this form will
          create a pending enrollment request in Supabase for admin payment verification.
        </p>
      </div>

      <aside class="mss-enroll-context-card">
        <span>Selected item</span>
        <strong>{{ selectedContext().title }}</strong>
        <p>{{ selectedContext().subtitle }}</p>
        <b>{{ selectedContext().priceLabel }}</b>
      </aside>
    </section>

    <section class="mss-enroll-shell">
      <form class="mss-enroll-form" [formGroup]="enrollmentForm" (ngSubmit)="submitPreview()">
        <div class="mss-form-section-heading">
          <p class="mss-eyebrow">Student Information</p>
          <h2>Basic details</h2>
        </div>

        <div class="mss-form-grid">
          <label>
            Full name
            <input formControlName="fullName" type="text" placeholder="Enter student full name" />
          </label>

          <label>
            Academic level
            <select formControlName="classLevel">
              <option value="Honours 1st Year">Honours 1st Year</option>
              <option value="Honours 2nd Year">Honours 2nd Year</option>
              <option value="Honours 3rd Year">Honours 3rd Year</option>
              <option value="Honours 4th Year">Honours 4th Year</option>
              <option value="Open Demo">Open Demo</option>
            </select>
          </label>

          <label>
            Institution name
            <input formControlName="institutionName" type="text" placeholder="College/university name" />
          </label>

          <label>
            Address
            <input formControlName="address" type="text" placeholder="District / area" />
          </label>

          <label>
            Student phone
            <input formControlName="studentPhone" type="tel" placeholder="01XXXXXXXXX" />
          </label>

          <label>
            Guardian phone
            <input formControlName="guardianPhone" type="tel" placeholder="01XXXXXXXXX" />
          </label>

          <label class="mss-span-2">
            Email address
            <input formControlName="email" type="email" placeholder="Optional email address" />
          </label>
        </div>

        <div class="mss-form-section-heading">
          <p class="mss-eyebrow">Course Selection</p>
          <h2>Choose course or package</h2>
        </div>

        <label>
          Selected course/package
          <select formControlName="selectedCourseOrPackage">
            <option value="">Select one</option>

            <optgroup label="Courses">
              @for (course of courses; track course.id) {
                <option [value]="'course:' + course.slug">
                  {{ course.title }} - {{ course.discountedPriceLabel || course.priceLabel }}
                </option>
              }
            </optgroup>

            <optgroup label="Packages">
              @for (coursePackage of packages; track coursePackage.id) {
                <option [value]="'package:' + coursePackage.slug">
                  {{ coursePackage.title }} - {{ coursePackage.discountedPriceLabel || coursePackage.priceLabel }}
                </option>
              }
            </optgroup>
          </select>
        </label>

        <div class="mss-form-section-heading">
          <p class="mss-eyebrow">Payment Information</p>
          <h2>Manual MFS verification</h2>
        </div>

        <div class="mss-payment-methods">
          <label>
            <input formControlName="paymentMethod" type="radio" value="bkash" />
            bKash
          </label>

          <label>
            <input formControlName="paymentMethod" type="radio" value="nagad" />
            Nagad
          </label>

          <label>
            <input formControlName="paymentMethod" type="radio" value="rocket" />
            Rocket
          </label>
        </div>

        <div class="mss-form-grid">
          <label>
            Sender number
            <input formControlName="senderNumber" type="tel" placeholder="Number used for payment" />
          </label>

          <label>
            Transaction ID
            <input formControlName="transactionId" type="text" placeholder="Example: 9AB123XYZ" />
          </label>

          <label class="mss-span-2">
            Payment note
            <textarea
              formControlName="paymentNote"
              rows="4"
              placeholder="Optional note for admin"
            ></textarea>
          </label>
        </div>

        <div class="mss-upload-placeholder">
          <strong>Payment proof upload</strong>
          <p>
            File upload will be connected later with Supabase Storage. For now,
            this section marks where the payment screenshot field will appear.
          </p>
        </div>

        @if (submittedMessage()) {
          <p class="mss-form-message">{{ submittedMessage() }}</p>
        }

        <div class="mss-enroll-actions">
          <button type="submit" class="mss-primary-button">Submit Enrollment Preview</button>
          <a routerLink="/courses" class="mss-secondary-button">Back to Courses</a>
        </div>
      </form>

      <aside class="mss-enroll-help-card">
        <p class="mss-eyebrow">How approval will work</p>
        <h2>Admin verifies before access unlocks.</h2>

        <ol>
          <li>Student submits enrollment request.</li>
          <li>Admin checks payment number and transaction ID.</li>
          <li>Admin approves or rejects the payment request.</li>
          <li>Approved students get course access in dashboard.</li>
        </ol>

        <div class="mss-enroll-note">
          <strong>Future Supabase work</strong>
          <p>
            This page will later connect to profiles, enrollments, payment requests,
            storage uploads, RLS policies, and admin approval workflow.
          </p>
        </div>
      </aside>
    </section>
  `,
})
export class EnrollPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly courses = COURSE_CATALOG_ITEMS;
  protected readonly packages = COURSE_PACKAGES;
  protected readonly submittedMessage = signal('');

  protected readonly selectedContext = computed(() => {
    const courseSlug = this.route.snapshot.queryParamMap.get('course');
    const packageSlug = this.route.snapshot.queryParamMap.get('package');

    const selectedCourse = this.courses.find((course) => course.slug === courseSlug);
    const selectedPackage = this.packages.find((coursePackage) => coursePackage.slug === packageSlug);

    if (selectedCourse) {
      return {
        title: selectedCourse.title,
        subtitle: selectedCourse.subtitle,
        priceLabel: selectedCourse.discountedPriceLabel || selectedCourse.priceLabel,
      };
    }

    if (selectedPackage) {
      return {
        title: selectedPackage.title,
        subtitle: selectedPackage.subtitle,
        priceLabel: selectedPackage.discountedPriceLabel || selectedPackage.priceLabel,
      };
    }

    return {
      title: 'No course selected yet',
      subtitle: 'Choose a course or package from the enrollment form.',
      priceLabel: 'Manual selection',
    };
  });

  protected readonly enrollmentForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    classLevel: ['Honours 1st Year', [Validators.required]],
    institutionName: ['', [Validators.required]],
    address: [''],
    studentPhone: ['', [Validators.required]],
    guardianPhone: ['', [Validators.required]],
    email: [''],
    selectedCourseOrPackage: [this.getInitialSelection(), [Validators.required]],
    paymentMethod: ['bkash', [Validators.required]],
    senderNumber: ['', [Validators.required]],
    transactionId: ['', [Validators.required]],
    paymentNote: [''],
  });

  protected submitPreview(): void {
    if (this.enrollmentForm.invalid) {
      this.enrollmentForm.markAllAsTouched();
      this.submittedMessage.set('Please fill in the required enrollment and payment fields.');
      return;
    }

    this.submittedMessage.set(
      'Preview submitted locally. Later this will create a pending enrollment request for admin approval.'
    );
  }

  private getInitialSelection(): string {
    const courseSlug = this.route.snapshot.queryParamMap.get('course');
    const packageSlug = this.route.snapshot.queryParamMap.get('package');

    if (courseSlug) {
      return `course:${courseSlug}`;
    }

    if (packageSlug) {
      return `package:${packageSlug}`;
    }

    return '';
  }
}
