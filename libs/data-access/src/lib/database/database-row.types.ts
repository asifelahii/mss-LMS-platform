export type DbAppRole = 'super_admin' | 'admin' | 'teacher' | 'student' | 'support';
export type DbProfileStatus = 'pending' | 'active' | 'blocked';
export type DbPublishStatus = 'draft' | 'review' | 'published' | 'archived';
export type DbCourseMode = 'recorded' | 'live' | 'hybrid';
export type DbCourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type DbCourseAccessType = 'free' | 'paid';
export type DbPackageType = 'single_subject' | 'full_year' | 'revision_batch' | 'free_demo';

export interface DbCourseRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string | null;
  academic_level: string;
  subject: string;
  mode: DbCourseMode;
  level: DbCourseLevel;
  access_type: DbCourseAccessType;
  price_amount: number;
  discounted_price_amount: number | null;
  currency: string;
  total_lessons: number;
  total_quizzes: number;
  duration_label: string | null;
  thumbnail_path: string | null;
  tags: string[];
  is_featured: boolean;
  status: DbPublishStatus;
  teacher_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCoursePackageRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  type: DbPackageType;
  price_amount: number;
  discounted_price_amount: number | null;
  currency: string;
  duration_label: string;
  recommended_for: string;
  features: string[];
  is_popular: boolean;
  status: DbPublishStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCoursePackageItemRow {
  id: string;
  package_id: string;
  course_id: string;
  position: number;
  created_at: string;
}

export interface DbProfileRow {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  role: DbAppRole;
  status: DbProfileStatus;
  avatar_path: string | null;
  created_at: string;
  updated_at: string;
}
