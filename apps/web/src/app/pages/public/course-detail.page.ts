import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CatalogDataService } from '@mss-platform/data-access';
import { CourseCatalogItem } from '@mss-platform/models';

import { COURSE_CATALOG_ITEMS } from '../../data/course-catalog.data';

@Component({
  selector: 'mss-course-detail-page',
  imports: [RouterLink],
  template: `
    @if (isLoading()) {
      <section class="mss-page-section">
        <p class="mss-eyebrow">Loading Course</p>
        <h1>Preparing course details...</h1>
        <p>Please wait while MSS loads the latest course information.</p>
      </section>
    } @else if (course(); as selectedCourse) {
      @if (dataNotice()) {
        <section class="mss-page-section">
          <p class="mss-form-message">{{ dataNotice() }}</p>
        </section>
      }

      <section class="mss-course-detail">
        <div>
          <p class="mss-eyebrow">{{ selectedCourse.academicLevel }}</p>
          <h1>{{ selectedCourse.title }}</h1>
          <p>{{ selectedCourse.subtitle }}</p>

          <div class="mss-course-detail__tags">
            @for (tag of selectedCourse.tags; track tag) {
              <span>{{ tag }}</span>
            }
          </div>

          <div class="mss-course-detail__actions">
            <a routerLink="/enroll" [queryParams]="{ course: selectedCourse.slug }" class="mss-primary-button">Enroll Now</a>
            <a routerLink="/packages" class="mss-secondary-button">View Packages</a>
          </div>
        </div>

        <aside class="mss-course-detail__card">
          <p>Course price</p>
          @if (selectedCourse.discountedPriceLabel) {
            <span class="mss-price-old">{{ selectedCourse.priceLabel }}</span>
            <strong>{{ selectedCourse.discountedPriceLabel }}</strong>
          } @else {
            <strong>{{ selectedCourse.priceLabel }}</strong>
          }

          <ul>
            <li>{{ selectedCourse.totalLessons }} lessons</li>
            <li>{{ selectedCourse.totalQuizzes }} quizzes/tests</li>
            <li>{{ selectedCourse.durationLabel }} planned duration</li>
            <li>{{ selectedCourse.mode }} learning mode</li>
          </ul>
        </aside>
      </section>

      <section class="mss-detail-grid">
        <article class="mss-detail-panel">
          <p class="mss-eyebrow">What you will learn</p>
          <h2>Structured learning outcomes</h2>
          <div class="mss-check-list">
            @for (outcome of learningOutcomes(selectedCourse); track outcome) {
              <span>{{ outcome }}</span>
            }
          </div>
        </article>

        <article class="mss-detail-panel">
          <p class="mss-eyebrow">Course support</p>
          <h2>Included with enrollment</h2>
          <div class="mss-check-list">
            <span>Chapter-wise recorded lessons</span>
            <span>PDF notes and study materials</span>
            <span>Quiz and model-test practice</span>
            <span>Payment-based protected access</span>
            <span>Support ticket for payment or access issues</span>
          </div>
        </article>
      </section>

      <section class="mss-content-preview">
        <div>
          <p class="mss-eyebrow">Course Content Preview</p>
          <h2>Chapter-by-chapter learning path</h2>
          <p>
            Full chapter and lesson management will be controlled by teachers from the
            teacher dashboard. Students will see unlocked lessons after enrollment approval.
          </p>
        </div>

        <div class="mss-preview-list">
          @for (chapter of previewChapters(selectedCourse); track chapter.title) {
            <article>
              <span>{{ chapter.label }}</span>
              <strong>{{ chapter.title }}</strong>
              <small>{{ chapter.summary }}</small>
            </article>
          }
        </div>
      </section>

      <section class="mss-teacher-enrollment-grid">
        <article class="mss-teacher-card">
          <p class="mss-eyebrow">Teacher</p>
          <h2>{{ selectedCourse.teacherName }}</h2>
          <p>
            Teachers will manage assigned courses, lessons, materials, quizzes,
            scheduled releases, and student progress from their dashboard.
          </p>
        </article>

        <article class="mss-enroll-card">
          <p class="mss-eyebrow">Enrollment Process</p>
          <h2>Manual payment, admin-approved access.</h2>
          <ol>
            <li>Select course or package</li>
            <li>Pay through bKash, Nagad, or Rocket</li>
            <li>Submit sender number, TXN ID, and proof</li>
            <li>Admin verifies and unlocks access</li>
          </ol>
          <a routerLink="/enroll" [queryParams]="{ course: selectedCourse.slug }" class="mss-primary-button">Start Enrollment</a>
        </article>
      </section>
    } @else {
      <section class="mss-page-section">
        <p class="mss-eyebrow">Course not found</p>
        <h1>We could not find this course.</h1>
        <a routerLink="/courses" class="mss-primary-button">Browse Courses</a>
      </section>
    }
  `,
})
export class CourseDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogDataService = inject(CatalogDataService);

  protected readonly course = signal<CourseCatalogItem | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly dataNotice = signal('');

  ngOnInit(): void {
    void this.loadCourse();
  }

  protected learningOutcomes(course: CourseCatalogItem): string[] {
    if (course.subject === 'Physics') {
      return [
        'Understand core mechanics concepts from basic to exam level',
        'Solve numerical problems with structured steps',
        'Revise formulas with organized study materials',
        'Practice chapter-wise quizzes and model questions',
      ];
    }

    return [
      'Build strong mathematical foundations',
      'Understand chapter concepts through organized lessons',
      'Solve common National University exam-style problems',
      'Practice with quizzes, notes, and revision materials',
    ];
  }

  protected previewChapters(course: CourseCatalogItem): Array<{
    label: string;
    title: string;
    summary: string;
  }> {
    if (course.subject === 'Physics') {
      return [
        {
          label: 'Chapter 01',
          title: 'Motion and basic mechanics',
          summary: 'Concepts, formulas, and beginner-level numerical practice.',
        },
        {
          label: 'Chapter 02',
          title: 'Force, work, and energy',
          summary: 'Problem-solving approach for common academic questions.',
        },
        {
          label: 'Chapter 03',
          title: 'Rotation and revision',
          summary: 'Exam-focused revision with model-test practice.',
        },
      ];
    }

    return [
      {
        label: 'Chapter 01',
        title: 'Foundation and core concepts',
        summary: 'Start with the required theory and problem-solving basics.',
      },
      {
        label: 'Chapter 02',
        title: 'Important examples and applications',
        summary: 'Learn patterns commonly used in university-level exams.',
      },
      {
        label: 'Chapter 03',
        title: 'Revision, quiz, and model test',
        summary: 'Practice and review before moving to advanced chapters.',
      },
    ];
  }

  private async loadCourse(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.course.set(null);
      return;
    }

    const fallbackCourse = COURSE_CATALOG_ITEMS.find((courseItem) => courseItem.slug === slug) ?? null;

    if (!this.catalogDataService.isConfigured()) {
      this.course.set(fallbackCourse);
      this.dataNotice.set('Demo course detail is shown because Supabase is not configured yet.');
      return;
    }

    this.isLoading.set(true);
    this.dataNotice.set('');

    try {
      const course = await this.catalogDataService.getPublishedCourseBySlug(slug);
      this.course.set(course);
    } catch (error) {
      this.course.set(fallbackCourse);
      this.dataNotice.set(
        error instanceof Error
          ? `${error.message} Showing demo course detail for now.`
          : 'Course detail could not be loaded. Showing demo course detail for now.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
