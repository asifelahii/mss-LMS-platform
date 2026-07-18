export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseMode = 'recorded' | 'live' | 'hybrid';
export type CourseAccessType = 'free' | 'paid';

export interface CourseCatalogItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  teacherName: string;
  academicLevel: string;
  subject: string;
  mode: CourseMode;
  level: CourseLevel;
  accessType: CourseAccessType;
  priceLabel: string;
  discountedPriceLabel?: string;
  totalLessons: number;
  totalQuizzes: number;
  durationLabel: string;
  thumbnailUrl?: string;
  tags: string[];
  isFeatured?: boolean;
}
