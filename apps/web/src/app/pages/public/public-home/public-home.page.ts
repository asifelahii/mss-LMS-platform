import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CatalogDataService } from '@mss-platform/data-access';
import { CourseCatalogItem } from '@mss-platform/models';
import { CourseCardComponent } from '@mss-platform/ui';

import { COURSE_CATALOG_ITEMS } from '../../../data/course-catalog.data';

const FEATURED_COURSE_FALLBACK = COURSE_CATALOG_ITEMS.filter((course) => course.isFeatured);

@Component({
  selector: 'mss-public-home-page',
  imports: [RouterLink, CourseCardComponent],
  templateUrl: './public-home.page.html',
  styleUrl: './public-home.page.scss',
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
