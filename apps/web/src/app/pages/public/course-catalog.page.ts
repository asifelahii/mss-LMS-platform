import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CatalogDataService } from '@mss-platform/data-access';
import { CourseCatalogItem } from '@mss-platform/models';
import { CourseCardComponent } from '@mss-platform/ui';

import { COURSE_CATALOG_ITEMS } from '../../data/course-catalog.data';

@Component({
  selector: 'mss-course-catalog-page',
  imports: [FormsModule, CourseCardComponent],
  template: `
    <section class="mss-catalog-hero">
      <p class="mss-eyebrow">Course Catalog</p>
      <h1>Find the right MSS course or batch.</h1>
      <p>
        Browse structured academic courses with recorded lessons, live support,
        quizzes, notes, and manual bKash/Nagad/Rocket enrollment flow.
      </p>
    </section>

    @if (dataNotice()) {
      <section class="mss-page-section">
        <p class="mss-form-message">{{ dataNotice() }}</p>
      </section>
    }

    <section class="mss-catalog-toolbar">
      <label>
        Search courses
        <input
          type="search"
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event)"
          placeholder="Search by subject, teacher, course..."
        />
      </label>

      <label>
        Subject
        <select [ngModel]="selectedSubject()" (ngModelChange)="selectedSubject.set($event)">
          <option value="all">All subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
        </select>
      </label>

      <label>
        Access
        <select [ngModel]="selectedAccess()" (ngModelChange)="selectedAccess.set($event)">
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="free">Free</option>
        </select>
      </label>
    </section>

    @if (isLoading()) {
      <section class="mss-empty-state">
        <h2>Loading courses...</h2>
        <p>Please wait while MSS loads the latest course catalog.</p>
      </section>
    } @else {
      <section class="mss-course-grid" aria-label="Course list">
        @for (course of filteredCourses(); track course.id) {
          <mss-course-card [course]="course" />
        } @empty {
          <div class="mss-empty-state">
            <h2>No courses found</h2>
            <p>Try changing your search or filter.</p>
          </div>
        }
      </section>
    }
  `,
})
export class CourseCatalogPageComponent implements OnInit {
  private readonly catalogDataService = inject(CatalogDataService);

  protected readonly searchTerm = signal('');
  protected readonly selectedSubject = signal('all');
  protected readonly selectedAccess = signal('all');

  protected readonly courses = signal<CourseCatalogItem[]>(COURSE_CATALOG_ITEMS);
  protected readonly isLoading = signal(false);
  protected readonly dataNotice = signal('');

  protected readonly filteredCourses = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const subject = this.selectedSubject();
    const access = this.selectedAccess();

    return this.courses().filter((course) => {
      const matchesSearch =
        !search ||
        course.title.toLowerCase().includes(search) ||
        course.subtitle.toLowerCase().includes(search) ||
        course.subject.toLowerCase().includes(search) ||
        course.teacherName.toLowerCase().includes(search) ||
        course.tags.some((tag) => tag.toLowerCase().includes(search));

      const matchesSubject = subject === 'all' || course.subject === subject;
      const matchesAccess = access === 'all' || course.accessType === access;

      return matchesSearch && matchesSubject && matchesAccess;
    });
  });

  ngOnInit(): void {
    void this.loadCourses();
  }

  private async loadCourses(): Promise<void> {
    if (!this.catalogDataService.isConfigured()) {
      this.courses.set(COURSE_CATALOG_ITEMS);
      this.dataNotice.set('Demo catalog is shown because Supabase is not configured yet.');
      return;
    }

    this.isLoading.set(true);
    this.dataNotice.set('');

    try {
      const courses = await this.catalogDataService.listPublishedCourses();
      this.courses.set(courses);
    } catch (error) {
      this.courses.set(COURSE_CATALOG_ITEMS);
      this.dataNotice.set(
        error instanceof Error
          ? `${error.message} Showing demo catalog for now.`
          : 'Course catalog could not be loaded. Showing demo catalog for now.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
