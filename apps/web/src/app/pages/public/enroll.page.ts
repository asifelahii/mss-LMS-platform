import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthStateService, SupabaseAuthService } from '@mss-platform/auth';
import {
  CatalogDataService,
  DbPaymentMethod,
  EnrollmentDataService,
} from '@mss-platform/data-access';
import { CourseCatalogItem, CoursePackage } from '@mss-platform/models';

import { COURSE_CATALOG_ITEMS } from '../../data/course-catalog.data';
import { COURSE_PACKAGES } from '../../data/course-packages.data';

interface SelectedEnrollmentContext {
  title: string;
  subtitle: string;
  priceLabel: string;
}

type EnrollmentSelection =
  | {
      type: 'course';
      id: string;
    }
  | {
      type: 'package';
      id: string;
    }
  | null;

@Component({
  selector: 'mss-enroll-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="mss-enroll-hero">
      <div>
        <p class="mss-eyebrow">Enrollment</p>
        <h1>Submit your course enrollment request.</h1>
        <p>
          Submit your selected course/package and manual MFS payment details.
          When Supabase is configured, this creates a pending enrollment and payment
          request for admin verification.
        </p>
      </div>

      <aside class="mss-enroll-context-card">
        <span>Selected item</span>
        <strong>{{ selectedContext().title }}</strong>
        <p>{{ selectedContext().subtitle }}</p>
        <b>{{ selectedContext().priceLabel }}</b>
      </aside>
    </section>

    @if (dataNotice()) {
      <section class="mss-page-section">
        <p class="mss-form-message">{{ dataNotice() }}</p>
      </section>
    }

    <section class="mss-enroll-shell">
      <form class="mss-enroll-form" [formGroup]="enrollmentForm" (ngSubmit)="submitEnrollment()">
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

        @if (isLoadingOptions()) {
          <p class="mss-form-message">Loading course and package options...</p>
        }

        <label>
          Selected course/package
          <select formControlName="selectedCourseOrPackage" (change)="syncSelectedValue()">
            <option value="">Select one</option>

            <optgroup label="Courses">
              @for (course of courses(); track course.id) {
                <option [value]="'course:' + course.id">
                  {{ course.title }} - {{ course.discountedPriceLabel || course.priceLabel }}
                </option>
              }
            </optgroup>

            <optgroup label="Packages">
              @for (coursePackage of packages(); track coursePackage.id) {
                <option [value]="'package:' + coursePackage.id">
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
            submit sender number, transaction ID, and optional note.
          </p>
        </div>

        @if (submittedMessage()) {
          <p class="mss-form-message">{{ submittedMessage() }}</p>
        }

        <div class="mss-enroll-actions">
          <button type="submit" class="mss-primary-button" [disabled]="isSubmitting()">
            {{ isSubmitting() ? 'Submitting...' : 'Submit Enrollment Request' }}
          </button>
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
          <strong>Real backend rule</strong>
          <p>
            Real enrollment requires a logged-in student profile. Without Supabase
            credentials, this page stays in safe demo-preview mode.
          </p>
        </div>
      </aside>
    </section>
  `,
})
export class EnrollPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly catalogDataService = inject(CatalogDataService);
  private readonly enrollmentDataService = inject(EnrollmentDataService);
  private readonly authState = inject(AuthStateService);
  private readonly authService = inject(SupabaseAuthService);

  protected readonly courses = signal<CourseCatalogItem[]>(COURSE_CATALOG_ITEMS);
  protected readonly packages = signal<CoursePackage[]>(COURSE_PACKAGES);
  protected readonly selectedValue = signal('');
  protected readonly submittedMessage = signal('');
  protected readonly dataNotice = signal('');
  protected readonly isLoadingOptions = signal(false);
  protected readonly isSubmitting = signal(false);

  protected readonly selectedContext = computed<SelectedEnrollmentContext>(() => {
    const selection = this.parseSelection(this.selectedValue());

    if (selection?.type === 'course') {
      const selectedCourse = this.courses().find((course) => course.id === selection.id);

      if (selectedCourse) {
        return {
          title: selectedCourse.title,
          subtitle: selectedCourse.subtitle,
          priceLabel: selectedCourse.discountedPriceLabel || selectedCourse.priceLabel,
        };
      }
    }

    if (selection?.type === 'package') {
      const selectedPackage = this.packages().find((coursePackage) => coursePackage.id === selection.id);

      if (selectedPackage) {
        return {
          title: selectedPackage.title,
          subtitle: selectedPackage.subtitle,
          priceLabel: selectedPackage.discountedPriceLabel || selectedPackage.priceLabel,
        };
      }
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
    selectedCourseOrPackage: ['', [Validators.required]],
    paymentMethod: ['bkash', [Validators.required]],
    senderNumber: ['', [Validators.required]],
    transactionId: ['', [Validators.required]],
    paymentNote: [''],
  });

  ngOnInit(): void {
    void this.loadEnrollmentOptions();
  }

  protected syncSelectedValue(): void {
    this.selectedValue.set(this.enrollmentForm.controls.selectedCourseOrPackage.value);
  }

  protected async submitEnrollment(): Promise<void> {
    this.submittedMessage.set('');

    if (this.enrollmentForm.invalid) {
      this.enrollmentForm.markAllAsTouched();
      this.submittedMessage.set('Please fill in the required enrollment and payment fields.');
      return;
    }

    const selection = this.parseSelection(this.enrollmentForm.controls.selectedCourseOrPackage.value);

    if (!selection) {
      this.submittedMessage.set('Please select a course or package before submitting.');
      return;
    }

    if (!this.enrollmentDataService.isConfigured()) {
      this.submittedMessage.set(
        'Demo preview submitted locally. Configure Supabase and login as a student to create a real pending enrollment request.'
      );
      return;
    }

    this.isSubmitting.set(true);

    try {
      const profile = this.authState.currentProfile() ?? (await this.authService.loadCurrentProfile());

      if (!profile) {
        this.submittedMessage.set(
          'Please login or register first. Real enrollment requests must be linked to a student profile.'
        );
        return;
      }

      const formValue = this.enrollmentForm.getRawValue();

      await this.enrollmentDataService.createEnrollmentWithPayment({
        studentId: profile.id,
        courseId: selection.type === 'course' ? selection.id : undefined,
        packageId: selection.type === 'package' ? selection.id : undefined,
        paymentMethod: formValue.paymentMethod as DbPaymentMethod,
        amount: this.parsePriceAmount(this.selectedContext().priceLabel),
        senderNumber: formValue.senderNumber,
        transactionId: formValue.transactionId,
        note: this.buildAdminNote(formValue),
      });

      this.submittedMessage.set(
        'Enrollment request submitted. Admin will verify the payment before unlocking access.'
      );
    } catch (error) {
      this.submittedMessage.set(
        error instanceof Error
          ? error.message
          : 'Enrollment request failed. Please try again.'
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private async loadEnrollmentOptions(): Promise<void> {
    if (!this.catalogDataService.isConfigured()) {
      this.courses.set(COURSE_CATALOG_ITEMS);
      this.packages.set(COURSE_PACKAGES);
      this.dataNotice.set('Demo enrollment options are shown because Supabase is not configured yet.');
      this.applyInitialSelectionFromQuery();
      return;
    }

    this.isLoadingOptions.set(true);
    this.dataNotice.set('');

    try {
      const [courses, packages] = await Promise.all([
        this.catalogDataService.listPublishedCourses(),
        this.catalogDataService.listPublishedPackages(),
      ]);

      this.courses.set(courses);
      this.packages.set(packages);
    } catch (error) {
      this.courses.set(COURSE_CATALOG_ITEMS);
      this.packages.set(COURSE_PACKAGES);
      this.dataNotice.set(
        error instanceof Error
          ? `${error.message} Showing demo enrollment options for now.`
          : 'Enrollment options could not be loaded. Showing demo options for now.'
      );
    } finally {
      this.isLoadingOptions.set(false);
      this.applyInitialSelectionFromQuery();
    }
  }

  private applyInitialSelectionFromQuery(): void {
    const courseSlug = this.route.snapshot.queryParamMap.get('course');
    const packageSlug = this.route.snapshot.queryParamMap.get('package');

    const selectedCourse = this.courses().find((course) => course.slug === courseSlug);
    const selectedPackage = this.packages().find((coursePackage) => coursePackage.slug === packageSlug);

    const selectionValue = selectedCourse
      ? `course:${selectedCourse.id}`
      : selectedPackage
        ? `package:${selectedPackage.id}`
        : '';

    this.enrollmentForm.controls.selectedCourseOrPackage.setValue(selectionValue);
    this.selectedValue.set(selectionValue);
  }

  private parseSelection(value: string): EnrollmentSelection {
    const [type, id] = value.split(':');

    if ((type === 'course' || type === 'package') && id) {
      return {
        type,
        id,
      };
    }

    return null;
  }

  private parsePriceAmount(priceLabel: string): number {
    const numericValue = priceLabel.replace(/[^\d]/g, '');

    return numericValue ? Number(numericValue) : 0;
  }

  private buildAdminNote(formValue: ReturnType<typeof this.enrollmentForm.getRawValue>): string {
    const noteParts = [
      `Student name: ${formValue.fullName}`,
      `Academic level: ${formValue.classLevel}`,
      `Institution: ${formValue.institutionName}`,
      `Address: ${formValue.address || 'Not provided'}`,
      `Student phone: ${formValue.studentPhone}`,
      `Guardian phone: ${formValue.guardianPhone}`,
      `Email: ${formValue.email || 'Not provided'}`,
      `Student note: ${formValue.paymentNote || 'None'}`,
    ];

    return noteParts.join('\n');
  }
}
