import { Component, computed, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { COURSE_CATALOG_ITEMS } from '../../data/course-catalog.data';

@Component({
  selector: 'mss-course-detail-page',
  imports: [RouterLink],
  template: `
    @if (course(); as selectedCourse) {
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
            <a routerLink="/register" class="mss-primary-button">Enroll Now</a>
            <a routerLink="/courses" class="mss-secondary-button">Back to Courses</a>
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
    } @else {
      <section class="mss-page-section">
        <p class="mss-eyebrow">Course not found</p>
        <h1>We could not find this course.</h1>
        <a routerLink="/courses" class="mss-primary-button">Browse Courses</a>
      </section>
    }
  `,
})
export class CourseDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly course = computed(() => {
    const slug = this.route.snapshot.paramMap.get('slug');

    return COURSE_CATALOG_ITEMS.find((courseItem) => courseItem.slug === slug) ?? null;
  });
}
