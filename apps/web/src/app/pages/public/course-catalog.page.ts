import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  `,
})
export class CourseCatalogPageComponent {
  protected readonly searchTerm = signal('');
  protected readonly selectedSubject = signal('all');
  protected readonly selectedAccess = signal('all');

  protected readonly courses = signal<CourseCatalogItem[]>(COURSE_CATALOG_ITEMS);

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
}
