import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { COURSE_PACKAGES } from '../../data/course-packages.data';

@Component({
  selector: 'mss-packages-page',
  imports: [RouterLink],
  template: `
    <section class="mss-packages-hero">
      <p class="mss-eyebrow">Course Packages</p>
      <h1>Choose the right MSS learning plan.</h1>
      <p>
        MSS supports single-subject courses, full-year packages, revision batches,
        and free demo access. Students can enroll through manual bKash, Nagad,
        or Rocket payment verification.
      </p>
    </section>

    <section class="mss-package-grid" aria-label="Course packages">
      @for (coursePackage of packages; track coursePackage.id) {
        <article class="mss-package-card" [class.is-popular]="coursePackage.isPopular">
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

          <a routerLink="/enroll" [queryParams]="{ package: coursePackage.slug }" class="mss-primary-button mss-full-button">
            {{ coursePackage.ctaLabel }}
          </a>
        </article>
      }
    </section>

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
export class PackagesPageComponent {
  protected readonly packages = COURSE_PACKAGES;
}

