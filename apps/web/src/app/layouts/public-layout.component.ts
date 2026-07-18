import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'mss-public-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="mss-public-shell">
      <header class="mss-public-header">
        <a routerLink="/" class="mss-brand">
          <span class="mss-brand-mark">M</span>
          <span>
            <strong>MSS</strong>
            <small>Math & Science Seekers</small>
          </span>
        </a>

        <nav class="mss-public-nav" aria-label="Public navigation">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/courses" routerLinkActive="active">Courses</a>
          <a routerLink="/login" routerLinkActive="active">Login</a>
          <a routerLink="/register" class="mss-nav-cta">Enroll Now</a>
        </nav>
      </header>

      <main>
        <router-outlet />
      </main>
    </div>
  `,
})
export class PublicLayoutComponent {}
