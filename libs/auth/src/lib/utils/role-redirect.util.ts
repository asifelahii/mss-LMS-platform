import { UserRole } from '@mss-platform/models';

export function getRoleRedirectPath(role: UserRole | null): string {
  if (role === 'teacher') {
    return '/teacher';
  }

  if (role === 'admin' || role === 'super_admin' || role === 'support') {
    return '/admin';
  }

  if (role === 'student') {
    return '/student';
  }

  return '/login';
}
