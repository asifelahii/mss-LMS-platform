import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CourseCardComponent } from '@mss-platform/ui';

import { COURSE_CATALOG_ITEMS } from '../../data/course-catalog.data';

@Component({
  selector: 'mss-public-home-page',
  imports: [RouterLink, CourseCardComponent],
  template: `
    <section class="mss-hero">
      <div class="mss-hero-content">
        <p class="mss-eyebrow">Bangla-first coaching platform</p>
        <h1>Premium Math & Science courses for serious academic learners.</h1>
        <p>
          MSS will provide structured courses, batches, lessons, notes, quizzes,
          payment approval, teacher dashboards, and protected student learning access.
        </p>

        <div class="mss-hero-actions">
          <a routerLink="/courses" class="mss-primary-button">Explore Courses</a>
          <a routerLink="/register" class="mss-secondary-button">Enroll Now</a>
        </div>
      </div>

      <div class="mss-hero-card">
        <span>Locked Product Direction</span>
        <strong>Angular + Supabase + Nx Monorepo</strong>
        <p>Production architecture first. Free-resource-first development.</p>
      </div>
    </section>

    <section class="mss-home-section">
      <div class="mss-section-heading">
        <div>
          <p class="mss-eyebrow">Featured courses</p>
          <h2>Start with our academic course tracks.</h2>
        </div>
        <a routerLink="/courses" class="mss-text-link">View all courses</a>
      </div>

      <div class="mss-course-grid">
        @for (course of featuredCourses; track course.id) {
          <mss-course-card [course]="course" />
        }
      </div>
    </section>

    <section class="mss-enrollment-strip">
      <div>
        <p class="mss-eyebrow">Simple enrollment</p>
        <h2>Choose course, submit payment info, wait for admin approval.</h2>
        <p>
          Inspired by real Bangladeshi coaching workflows: student details,
          guardian/contact information, bKash/Nagad/Rocket transaction ID, and manual approval.
        </p>
      </div>
      <a routerLink="/register" class="mss-primary-button">Create Student Account</a>
    </section>
  `,
})
export class PublicHomePageComponent {
  protected readonly featuredCourses = COURSE_CATALOG_ITEMS.filter((course) => course.isFeatured);
}
