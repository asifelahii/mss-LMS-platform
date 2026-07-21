import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CatalogDataService } from '@mss-platform/data-access';
import { CoursePackage } from '@mss-platform/models';

import { COURSE_PACKAGES } from '../../data/course-packages.data';

@Component({
  selector: 'mss-packages-page',
  imports: [RouterLink],
  template: `
    <section class="mss-packages-hero">
      <p class="mss-eyebrow">Course Packages</p>
      <h1>Choose the right MSS learning plan.</h1>
      <p>
        MSS supports single-subject courses, full-year packages, revision
        batches, and free demo access. Students can enroll through manual bKash,
        Nagad, or Rocket payment verification.
      </p>
    </section>

    @if (dataNotice()) {
      <section class="mss-page-section">
        <p class="mss-form-message">{{ dataNotice() }}</p>
      </section>
    }

    @if (isLoading()) {
      <section class="mss-empty-state">
        <h2>Loading packages...</h2>
        <p>Please wait while MSS loads the latest learning plans.</p>
      </section>
    } @else {
      <section class="mss-package-grid" aria-label="Course packages">
        @for (coursePackage of packages(); track coursePackage.id) {
          <article
            class="mss-package-card"
            [class.is-popular]="coursePackage.isPopular"
          >
            @if (coursePackage.isPopular) {
              <span class="mss-package-badge">Most Popular</span>
            }

            <p class="mss-eyebrow">{{ coursePackage.durationLabel }}</p>
            <h2>{{ coursePackage.title }}</h2>
            <p>{{ coursePackage.subtitle }}</p>

            <div class="mss-package-price">
              @if (coursePackage.discountedPriceLabel) {
                <span>{{ coursePackage.priceLabel }}</span>
                <strong>{{ coursePackage.discountedPriceLabel }}</strong>
              } @else {
                <strong>{{ coursePackage.priceLabel }}</strong>
              }
            </div>

            <p class="mss-package-recommended">
              {{ coursePackage.recommendedFor }}
            </p>

            <ul>
              @for (feature of coursePackage.features; track feature) {
                <li>{{ feature }}</li>
              }
            </ul>

            <a
              routerLink="/enroll"
              [queryParams]="{ package: coursePackage.slug }"
              class="mss-primary-button mss-full-button"
            >
              {{ coursePackage.ctaLabel }}
            </a>
          </article>
        } @empty {
          <div class="mss-empty-state">
            <h2>No packages found</h2>
            <p>Packages will appear here after they are published.</p>
          </div>
        }
      </section>
    }

    <section class="mss-payment-flow">
      <div>
        <p class="mss-eyebrow">Enrollment Flow</p>
        <h2>Simple manual payment workflow for Bangladesh.</h2>
        <p>
          Students will choose a course/package, submit their payment method,
          sender number, transaction ID, and proof screenshot. Admin will verify
          and unlock access.
        </p>
      </div>

      <div class="mss-flow-steps">
        <span>1. Choose course</span>
        <span>2. Pay via MFS</span>
        <span>3. Submit TXN ID</span>
        <span>4. Admin approves</span>
      </div>
    </section>
  `,
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

