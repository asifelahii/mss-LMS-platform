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

import { COURSE_CATALOG_ITEMS } from '../../../data/course-catalog.data';
import { COURSE_PACKAGES } from '../../../data/course-packages.data';

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
  templateUrl: './enroll.page.html',
  styleUrl: './enroll.page.scss',
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
