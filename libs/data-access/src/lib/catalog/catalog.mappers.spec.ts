import { mapCourseRowToCatalogItem, mapPackageRowToCoursePackage } from './catalog.mappers';
import { DbCoursePackageRow, DbCourseRow } from '../database/database-row.types';

describe('catalog mappers', () => {
  it('maps a course row to a public catalog item', () => {
    const row: DbCourseRow = {
      id: 'course-1',
      slug: 'calculus-1-complete-course',
      title: 'Calculus 1 Complete Course',
      subtitle: 'Limits and differentiation.',
      description: null,
      academic_level: 'Honours 1st Year',
      subject: 'Mathematics',
      mode: 'recorded',
      level: 'beginner',
      access_type: 'paid',
      price_amount: 1500,
      discounted_price_amount: 1200,
      currency: 'BDT',
      total_lessons: 42,
      total_quizzes: 12,
      duration_label: '10 weeks',
      thumbnail_path: null,
      tags: ['NU Focused', 'PDF Notes'],
      is_featured: true,
      status: 'published',
      teacher_id: null,
      created_by: null,
      created_at: '2026-07-18T00:00:00Z',
      updated_at: '2026-07-18T00:00:00Z',
    };

    expect(mapCourseRowToCatalogItem(row)).toEqual({
      id: 'course-1',
      slug: 'calculus-1-complete-course',
      title: 'Calculus 1 Complete Course',
      subtitle: 'Limits and differentiation.',
      teacherName: 'MSS Academic Team',
      academicLevel: 'Honours 1st Year',
      subject: 'Mathematics',
      mode: 'recorded',
      level: 'beginner',
      accessType: 'paid',
      priceLabel: '\u09F31,500',
      discountedPriceLabel: '\u09F31,200',
      totalLessons: 42,
      totalQuizzes: 12,
      durationLabel: '10 weeks',
      thumbnailUrl: undefined,
      tags: ['NU Focused', 'PDF Notes'],
      isFeatured: true,
    });
  });

  it('maps a package row to a public package item', () => {
    const row: DbCoursePackageRow = {
      id: 'package-1',
      slug: 'full-year-package',
      title: 'Full Year Package',
      subtitle: 'A complete academic year package.',
      type: 'full_year',
      price_amount: 6000,
      discounted_price_amount: 4999,
      currency: 'BDT',
      duration_label: 'Full academic year',
      recommended_for: 'Serious academic students.',
      features: ['Multiple subjects', 'Priority support'],
      is_popular: true,
      status: 'published',
      created_by: null,
      created_at: '2026-07-18T00:00:00Z',
      updated_at: '2026-07-18T00:00:00Z',
    };

    expect(mapPackageRowToCoursePackage(row)).toEqual({
      id: 'package-1',
      slug: 'full-year-package',
      title: 'Full Year Package',
      subtitle: 'A complete academic year package.',
      type: 'full_year',
      priceLabel: '\u09F36,000',
      discountedPriceLabel: '\u09F34,999',
      durationLabel: 'Full academic year',
      recommendedFor: 'Serious academic students.',
      features: ['Multiple subjects', 'Priority support'],
      isPopular: true,
      ctaLabel: 'Start Enrollment',
    });
  });
});
