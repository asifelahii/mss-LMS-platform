import { CourseCatalogItem, CoursePackage } from '@mss-platform/models';

import { DbCoursePackageRow, DbCourseRow } from '../database/database-row.types';

function formatBdtPrice(amount: number): string {
  if (amount <= 0) {
    return 'Free';
  }

  return `\u09F3${amount.toLocaleString('en-US')}`;
}

export function mapCourseRowToCatalogItem(row: DbCourseRow): CourseCatalogItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    teacherName: 'MSS Academic Team',
    academicLevel: row.academic_level,
    subject: row.subject,
    mode: row.mode,
    level: row.level,
    accessType: row.access_type,
    priceLabel: formatBdtPrice(row.price_amount),
    discountedPriceLabel:
      row.discounted_price_amount === null
        ? undefined
        : formatBdtPrice(row.discounted_price_amount),
    totalLessons: row.total_lessons,
    totalQuizzes: row.total_quizzes,
    durationLabel: row.duration_label ?? 'Self-paced',
    thumbnailUrl: row.thumbnail_path ?? undefined,
    tags: row.tags,
    isFeatured: row.is_featured,
  };
}

export function mapPackageRowToCoursePackage(row: DbCoursePackageRow): CoursePackage {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    type: row.type,
    priceLabel: formatBdtPrice(row.price_amount),
    discountedPriceLabel:
      row.discounted_price_amount === null
        ? undefined
        : formatBdtPrice(row.discounted_price_amount),
    durationLabel: row.duration_label,
    recommendedFor: row.recommended_for,
    features: row.features,
    isPopular: row.is_popular,
    ctaLabel: row.price_amount <= 0 ? 'Start Free Demo' : 'Start Enrollment',
  };
}
