export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'teacher'
  | 'student'
  | 'support';

export type ProfileStatus = 'active' | 'blocked' | 'pending';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: ProfileStatus;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
