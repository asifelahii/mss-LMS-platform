import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CatalogDataService } from '@mss-platform/data-access';
import { CourseCatalogItem } from '@mss-platform/models';

@Component({
  selector: 'mss-admin-course-list-page',
  imports: [RouterLink],
  templateUrl: './admin-course-list.page.html',
  styleUrl: './admin-course-list.page.scss',
})
export class AdminCourseListPageComponent implements OnInit {
  private readonly catalogService = inject(CatalogDataService);

  protected readonly courses = signal<CourseCatalogItem[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly message = signal('');

  ngOnInit(): void {
    void this.loadCourses();
  }

  private async loadCourses(): Promise<void> {
    if (!this.catalogService.isConfigured()) {
      this.message.set(
        'Supabase is not configured. Showing demo data is disabled for admin.',
      );

      return;
    }

    this.isLoading.set(true);

    try {
      const courses = await this.catalogService.listAllCourses();

      this.courses.set(courses);
    } catch (error) {
      this.message.set(
        error instanceof Error ? error.message : 'Failed to load courses.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
