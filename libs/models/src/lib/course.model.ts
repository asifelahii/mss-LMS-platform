export type PublishStatus = 'draft' | 'review' | 'published' | 'archived';

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  price: number;
  discountPrice?: number | null;
  status: PublishStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  id: string;
  courseId: string;
  title: string;
  startsAt?: string | null;
  endsAt?: string | null;
  enrollmentDeadline?: string | null;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  orderNo: number;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  chapterId: string;
  title: string;
  description?: string | null;
  videoAssetId?: string | null;
  orderNo: number;
  status: PublishStatus;
  scheduledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
