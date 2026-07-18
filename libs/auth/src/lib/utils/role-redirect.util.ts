import { UserRole } from '@mss-platform/models';

export function getDefaultRouteForRole(role: UserRole | null): string {
  if (role === 'super_admin' || role === 'admin') {
    return '/admin';
  }

  if (role === 'teacher') {
    return '/teacher';
  }

  if (role === 'support') {
    return '/admin/support';
  }

  if (role === 'student') {
    return '/student';
  }

  return '/login';
}
