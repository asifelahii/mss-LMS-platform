import { Component } from '@angular/core';

@Component({
  selector: 'mss-admin-dashboard-page',
  template: `
    <section class="mss-page-section">
      <p class="mss-eyebrow">Admin</p>
      <h2>Admin operations dashboard</h2>
      <p>Payments, enrollments, users, device resets, support tickets, reports, and audit logs will live here.</p>
    </section>
  `,
})
export class AdminDashboardPageComponent {}
