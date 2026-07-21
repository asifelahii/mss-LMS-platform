import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CatalogDataService } from '@mss-platform/data-access';
import { CourseCatalogItem } from '@mss-platform/models';
import { CourseCardComponent } from '@mss-platform/ui';

import { COURSE_CATALOG_ITEMS } from '../../data/course-catalog.data';

const FEATURED_COURSE_FALLBACK = COURSE_CATALOG_ITEMS.filter((course) => course.isFeatured);

@Component({
  selector: 'mss-public-home-page',
  imports: [RouterLink, CourseCardComponent],
  template: `
    <section class="mss-hero">
      <div class="mss-hero-content">
        <p class="mss-eyebrow">Bangla-first coaching platform</p>
        <h1>Premium Math & Science courses for serious academic learners.</h1>
        <p>
          MSS provides structured courses, batches, lessons, notes, quizzes,
          payment approval, teacher dashboards, and protected student learning access.
        </p>

        <div class="mss-hero-actions">
          <a routerLink="/courses" class="mss-primary-button">Explore Courses</a>
          <a routerLink="/enroll" class="mss-secondary-button">Enroll Now</a>
        </div>
      </div>

      <div class="mss-hero-card">
        <span>Production-ready direction</span>
        <strong>Course selling + student learning + teacher/admin operations</strong>
        <p>Built with Angular, Nx monorepo, Supabase, and free-resource-first development.</p>
      </div>
    </section>

    <section class="mss-stats-strip">
      <article>
        <strong>4+</strong>
        <span>Course tracks planned</span>
      </article>
      <article>
        <strong>3</strong>
        <span>Payment methods</span>
      </article>
      <article>
        <strong>5</strong>
        <span>Role-based portals</span>
      </article>
      <article>
        <strong>Free-first</strong>
        <span>Resource strategy</span>
      </article>
    </section>

    <section class="mss-home-section">
      <div class="mss-section-heading">
        <div>
          <p class="mss-eyebrow">Featured courses</p>
          <h2>Start with our academic course tracks.</h2>
        </div>
        <a routerLink="/courses" class="mss-text-link">View all courses</a>
      </div>

      @if (dataNotice()) {
        <p class="mss-form-message">{{ dataNotice() }}</p>
      }

      @if (isLoading()) {
        <div class="mss-empty-state">
          <h2>Loading featured courses...</h2>
          <p>Please wait while MSS loads the latest featured courses.</p>
        </div>
      } @else {
        <div class="mss-course-grid">
          @for (course of featuredCourses(); track course.id) {
            <mss-course-card [course]="course" />
          } @empty {
            <div class="mss-empty-state">
              <h2>No featured courses yet</h2>
              <p>Published featured courses will appear here.</p>
            </div>
          }
        </div>
      }
    </section>

    <section class="mss-feature-grid">
      <article>
        <p class="mss-eyebrow">For Students</p>
        <h2>Learn from one organized dashboard.</h2>
        <p>Access enrolled courses, lessons, PDFs, quizzes, payment status, and support tickets.</p>
      </article>

      <article>
        <p class="mss-eyebrow">For Teachers</p>
        <h2>Manage content without developer help.</h2>
        <p>Create chapters, upload materials, add lessons, schedule releases, and track progress.</p>
      </article>

      <article>
        <p class="mss-eyebrow">For Admins</p>
        <h2>Control payment and access workflows.</h2>
        <p>Approve payments, manage enrollments, handle support, and monitor audit logs.</p>
      </article>
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
      <a routerLink="/enroll" class="mss-primary-button">Start Enrollment</a>
    </section>
  `,
})
export class PublicHomePageComponent implements OnInit {
  private readonly catalogDataService = inject(CatalogDataService);

  protected readonly featuredCourses = signal<CourseCatalogItem[]>(FEATURED_COURSE_FALLBACK);
  protected readonly isLoading = signal(false);
  protected readonly dataNotice = signal('');

  ngOnInit(): void {
    void this.loadFeaturedCourses();
  }

  private async loadFeaturedCourses(): Promise<void> {
    if (!this.catalogDataService.isConfigured()) {
      this.featuredCourses.set(FEATURED_COURSE_FALLBACK);
      this.dataNotice.set('Demo featured courses are shown because Supabase is not configured yet.');
      return;
    }

    this.isLoading.set(true);
    this.dataNotice.set('');

    try {
      const courses = await this.catalogDataService.listPublishedCourses();
      const featuredCourses = courses.filter((course) => course.isFeatured);

      this.featuredCourses.set(featuredCourses);
    } catch (error) {
      this.featuredCourses.set(FEATURED_COURSE_FALLBACK);
      this.dataNotice.set(
        error instanceof Error
          ? `${error.message} Showing demo featured courses for now.`
          : 'Featured courses could not be loaded. Showing demo featured courses for now.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
