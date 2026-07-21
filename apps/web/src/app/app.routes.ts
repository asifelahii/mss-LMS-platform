import type { CanActivateFn, Routes } from '@angular/router';

import type { UserRole } from '@mss-platform/models';

const lazyAuthGuard: CanActivateFn = (route, state) =>
  import('@mss-platform/auth').then((m) => m.authGuard(route, state)) as ReturnType<CanActivateFn>;

const lazyGuestGuard: CanActivateFn = (route, state) =>
  import('@mss-platform/auth').then((m) => m.guestGuard(route, state)) as ReturnType<CanActivateFn>;

function lazyRoleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return (route, state) =>
    import('@mss-platform/auth').then((m) =>
      m.roleGuard(allowedRoles)(route, state)
    ) as ReturnType<CanActivateFn>;
}

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/public/public-home.page').then((m) => m.PublicHomePageComponent),
        title: 'MSS | Math & Science Seekers',
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./pages/public/course-catalog.page').then((m) => m.CourseCatalogPageComponent),
        title: 'Courses | MSS',
      },
      {
        path: 'courses/:slug',
        loadComponent: () =>
          import('./pages/public/course-detail.page').then((m) => m.CourseDetailPageComponent),
        title: 'Course Details | MSS',
      },
      {
        path: 'packages',
        loadComponent: () =>
          import('./pages/public/packages.page').then((m) => m.PackagesPageComponent),
        title: 'Packages | MSS',
      },
      {
        path: 'enroll',
        loadComponent: () =>
          import('./pages/public/enroll.page').then((m) => m.EnrollPageComponent),
        title: 'Enroll | MSS',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/login.page').then((m) => m.LoginPageComponent),
        canActivate: [lazyGuestGuard],
        title: 'Login | MSS',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/auth/register.page').then((m) => m.RegisterPageComponent),
        canActivate: [lazyGuestGuard],
        title: 'Register | MSS',
      },
    ],
  },
  {
    path: 'student',
    loadComponent: () =>
      import('./layouts/dashboard-layout.component').then((m) => m.DashboardLayoutComponent),
    canActivate: [lazyAuthGuard, lazyRoleGuard(['student', 'admin', 'super_admin'])],
    data: {
      portal: 'student',
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/student/student-dashboard.page').then(
            (m) => m.StudentDashboardPageComponent
          ),
        title: 'Student Dashboard | MSS',
      },
    ],
  },
  {
    path: 'teacher',
    loadComponent: () =>
      import('./layouts/dashboard-layout.component').then((m) => m.DashboardLayoutComponent),
    canActivate: [lazyAuthGuard, lazyRoleGuard(['teacher', 'admin', 'super_admin'])],
    data: {
      portal: 'teacher',
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/teacher/teacher-dashboard.page').then(
            (m) => m.TeacherDashboardPageComponent
          ),
        title: 'Teacher Dashboard | MSS',
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/dashboard-layout.component').then((m) => m.DashboardLayoutComponent),
    canActivate: [lazyAuthGuard, lazyRoleGuard(['admin', 'super_admin'])],
    data: {
      portal: 'admin',
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin/admin-dashboard.page').then((m) => m.AdminDashboardPageComponent),
        title: 'Admin Dashboard | MSS',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
