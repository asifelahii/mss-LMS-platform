import { Routes } from '@angular/router';

import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout.component';
import { LoginPageComponent } from './pages/auth/login.page';
import { RegisterPageComponent } from './pages/auth/register.page';
import { AdminDashboardPageComponent } from './pages/admin/admin-dashboard.page';
import { CourseCatalogPageComponent } from './pages/public/course-catalog.page';
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
        path: 'login',
        component: LoginPageComponent,
        title: 'Login | MSS',
      },
      {
        path: 'register',
        component: RegisterPageComponent,
        title: 'Register | MSS',
      },
    ],
  },
  {
    path: 'student',
    component: DashboardLayoutComponent,
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
