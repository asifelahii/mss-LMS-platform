import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CatalogDataService } from '@mss-platform/data-access';
import { CoursePackage } from '@mss-platform/models';

import { COURSE_PACKAGES } from '../../../data/course-packages.data';

@Component({
  selector: 'mss-packages-page',
  imports: [RouterLink],
  templateUrl: './packages.page.html',
  styleUrl: './packages.page.scss',
})
export class PackagesPageComponent implements OnInit {
  private readonly catalogDataService = inject(CatalogDataService);

  protected readonly packages = signal<CoursePackage[]>(COURSE_PACKAGES);
  protected readonly isLoading = signal(false);
  protected readonly dataNotice = signal('');

  ngOnInit(): void {
    void this.loadPackages();
  }

  private async loadPackages(): Promise<void> {
    if (!this.catalogDataService.isConfigured()) {
      this.packages.set(COURSE_PACKAGES);
      this.dataNotice.set(
        'Demo packages are shown because Supabase is not configured yet.',
      );
      return;
    }

    this.isLoading.set(true);
    this.dataNotice.set('');

    try {
      const packages = await this.catalogDataService.listPublishedPackages();
      this.packages.set(packages);
    } catch (error) {
      this.packages.set(COURSE_PACKAGES);
      this.dataNotice.set(
        error instanceof Error
          ? `${error.message} Showing demo packages for now.`
          : 'Packages could not be loaded. Showing demo packages for now.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
