import { Routes } from '@angular/router';

import { authGuard, guestGuard, roleGuard } from '@mss-platform/auth';

import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout.component';
import { LoginPageComponent } from './pages/auth/login.page';
import { RegisterPageComponent } from './pages/auth/register.page';
import { AdminDashboardPageComponent } from './pages/admin/admin-dashboard.page';
import { CourseCatalogPageComponent } from './pages/public/course-catalog.page';
import { CourseDetailPageComponent } from './pages/public/course-detail.page';
import { EnrollPageComponent } from './pages/public/enroll.page';
import { PackagesPageComponent } from './pages/public/packages.page';
import { PublicHomePageComponent } from './pages/public/public-home.page';
import { StudentDashboardPageComponent } from './pages/student/student-dashboard.page';
import { TeacherDashboardPageComponent } from './pages/teacher/teacher-dashboard.page';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: PublicHomePageComponent,
        title: 'MSS | Math & Science Seekers',
      },
      {
        path: 'courses',
        component: CourseCatalogPageComponent,
        title: 'Courses | MSS',
      },
      {
        path: 'courses/:slug',
        component: CourseDetailPageComponent,
        title: 'Course Details | MSS',
      },
      {
        path: 'packages',
        component: PackagesPageComponent,
        title: 'Packages | MSS',
      },
      {
        path: 'enroll',
        component: EnrollPageComponent,
        title: 'Enroll | MSS',
      },
      {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [guestGuard],
        title: 'Login | MSS',
      },
      {
        path: 'register',
        component: RegisterPageComponent,
        canActivate: [guestGuard],
        title: 'Register | MSS',
      },
    ],
  },
  {
    path: 'student',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['student', 'admin', 'super_admin'])],
    data: {
      portal: 'student',
    },
    children: [
      {
        path: '',
        component: StudentDashboardPageComponent,
        title: 'Student Dashboard | MSS',
      },
    ],
  },
  {
    path: 'teacher',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['teacher', 'admin', 'super_admin'])],
    data: {
      portal: 'teacher',
    },
    children: [
      {
        path: '',
        component: TeacherDashboardPageComponent,
        title: 'Teacher Dashboard | MSS',
      },
    ],
  },
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard(['admin', 'super_admin'])],
    data: {
      portal: 'admin',
    },
    children: [
      {
        path: '',
        component: AdminDashboardPageComponent,
        title: 'Admin Dashboard | MSS',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
