import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CatalogDataService } from '@mss-platform/data-access';
import { CourseCatalogItem } from '@mss-platform/models';
import { CourseCardComponent } from '@mss-platform/ui';

import { COURSE_CATALOG_ITEMS } from '../../../data/course-catalog.data';

@Component({
  selector: 'mss-course-catalog-page',
  imports: [FormsModule, CourseCardComponent],
  templateUrl: './course-catalog.page.html',
  styleUrl: './course-catalog.page.scss',
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
