import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mss-public-home-page',
  imports: [RouterLink],
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
  `,
})
export class PublicHomePageComponent {}
