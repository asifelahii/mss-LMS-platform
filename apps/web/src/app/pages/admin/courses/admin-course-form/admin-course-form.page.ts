import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mss-admin-course-form-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-course-form.page.html',
  styleUrl: './admin-course-form.page.scss',
})
export class AdminCourseFormPageComponent {
  private readonly formBuilder = inject(FormBuilder);

  protected submittedMessage = '';

  protected readonly courseForm = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    subtitle: ['', Validators.required],

    teacherName: ['MSS Academic Team', Validators.required],

    academicLevel: ['Honours 1st Year', Validators.required],

    subject: ['Mathematics', Validators.required],

    mode: ['recorded', Validators.required],

    accessType: ['paid', Validators.required],

    priceLabel: ['৳1500', Validators.required],

    discountedPriceLabel: [''],

    totalLessons: [30, Validators.required],

    totalQuizzes: [5, Validators.required],

    durationLabel: ['6 weeks', Validators.required],

    tags: ['PDF Notes, Quizzes'],

    status: ['draft', Validators.required],
  });

  protected saveCourse(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      this.submittedMessage = 'Please complete all required fields.';
      return;
    }

    console.log('Course Data:', this.courseForm.getRawValue());

    this.submittedMessage = 'Course saved successfully (demo mode).';
  }
}
