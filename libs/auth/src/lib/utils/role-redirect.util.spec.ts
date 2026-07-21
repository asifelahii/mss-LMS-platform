import { getRoleRedirectPath } from './role-redirect.util';

describe('getRoleRedirectPath', () => {
  it('redirects students to student dashboard', () => {
    expect(getRoleRedirectPath('student')).toBe('/student');
  });

  it('redirects teachers to teacher dashboard', () => {
    expect(getRoleRedirectPath('teacher')).toBe('/teacher');
  });

  it('redirects admins, super admins, and support users to admin dashboard', () => {
    expect(getRoleRedirectPath('admin')).toBe('/admin');
    expect(getRoleRedirectPath('super_admin')).toBe('/admin');
    expect(getRoleRedirectPath('support')).toBe('/admin');
  });

  it('redirects unknown/null roles to login', () => {
    expect(getRoleRedirectPath(null)).toBe('/login');
  });
});
