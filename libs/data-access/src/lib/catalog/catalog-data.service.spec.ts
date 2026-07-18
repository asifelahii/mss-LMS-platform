import { TestBed } from '@angular/core/testing';

import { SupabaseClientService } from '../supabase/supabase-client.service';
import { CatalogDataService } from './catalog-data.service';

describe('CatalogDataService', () => {
  function setupListQuery(data: unknown[], error: { message: string } | null = null) {
    const secondOrder = jest.fn().mockResolvedValue({ data, error });
    const firstOrder = jest.fn(() => ({ order: secondOrder }));
    const eq = jest.fn(() => ({ order: firstOrder }));
    const select = jest.fn(() => ({ eq }));
    const from = jest.fn(() => ({ select }));

    TestBed.configureTestingModule({
      providers: [
        CatalogDataService,
        {
          provide: SupabaseClientService,
          useValue: {
            client: {
              from,
            },
          },
        },
      ],
    });

    return {
      service: TestBed.inject(CatalogDataService),
      from,
      select,
      eq,
      firstOrder,
      secondOrder,
    };
  }

  function setupSingleQuery(data: unknown, error: { message: string } | null = null) {
    const maybeSingle = jest.fn().mockResolvedValue({ data, error });
    const secondEq = jest.fn(() => ({ maybeSingle }));
    const firstEq = jest.fn(() => ({ eq: secondEq }));
    const select = jest.fn(() => ({ eq: firstEq }));
    const from = jest.fn(() => ({ select }));

    TestBed.configureTestingModule({
      providers: [
        CatalogDataService,
        {
          provide: SupabaseClientService,
          useValue: {
            client: {
              from,
            },
          },
        },
      ],
    });

    return {
      service: TestBed.inject(CatalogDataService),
      from,
      select,
      firstEq,
      secondEq,
      maybeSingle,
    };
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('loads published courses and maps them to catalog items', async () => {
    const { service, from } = setupListQuery([
      {
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
        tags: ['NU Focused'],
        is_featured: true,
        status: 'published',
        teacher_id: null,
        created_by: null,
        created_at: '2026-07-18T00:00:00Z',
        updated_at: '2026-07-18T00:00:00Z',
      },
    ]);

    const courses = await service.listPublishedCourses();

    expect(from).toHaveBeenCalledWith('courses');
    expect(courses).toHaveLength(1);
    expect(courses[0].slug).toBe('calculus-1-complete-course');
    expect(courses[0].priceLabel).toBe('\u09F31,500');
  });

  it('loads a published course by slug', async () => {
    const { service, from } = setupSingleQuery({
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
      discounted_price_amount: null,
      currency: 'BDT',
      total_lessons: 42,
      total_quizzes: 12,
      duration_label: '10 weeks',
      thumbnail_path: null,
      tags: [],
      is_featured: true,
      status: 'published',
      teacher_id: null,
      created_by: null,
      created_at: '2026-07-18T00:00:00Z',
      updated_at: '2026-07-18T00:00:00Z',
    });

    const course = await service.getPublishedCourseBySlug('calculus-1-complete-course');

    expect(from).toHaveBeenCalledWith('courses');
    expect(course?.slug).toBe('calculus-1-complete-course');
  });

  it('loads published packages and maps them to package items', async () => {
    const { service, from } = setupListQuery([
      {
        id: 'package-1',
        slug: 'full-year-package',
        title: 'Full Year Package',
        subtitle: 'A complete academic year package.',
        type: 'full_year',
        price_amount: 6000,
        discounted_price_amount: 4999,
        currency: 'BDT',
        duration_label: 'Full academic year',
        recommended_for: 'Serious students.',
        features: ['Multiple subjects'],
        is_popular: true,
        status: 'published',
        created_by: null,
        created_at: '2026-07-18T00:00:00Z',
        updated_at: '2026-07-18T00:00:00Z',
      },
    ]);

    const packages = await service.listPublishedPackages();

    expect(from).toHaveBeenCalledWith('course_packages');
    expect(packages).toHaveLength(1);
    expect(packages[0].slug).toBe('full-year-package');
    expect(packages[0].discountedPriceLabel).toBe('\u09F34,999');
  });

  it('returns null when a published course is not found', async () => {
    const { service } = setupSingleQuery(null);

    await expect(service.getPublishedCourseBySlug('missing-course')).resolves.toBeNull();
  });

  it('throws readable errors when Supabase returns an error', async () => {
    const { service } = setupListQuery([], { message: 'network failed' });

    await expect(service.listPublishedCourses()).rejects.toThrow(
      'Failed to load courses: network failed'
    );
  });
});
