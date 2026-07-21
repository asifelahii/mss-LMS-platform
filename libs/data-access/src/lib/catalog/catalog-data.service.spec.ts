import { TestBed } from '@angular/core/testing';

import { SupabaseClientService } from '../supabase/supabase-client.service';
import { CatalogDataService } from './catalog-data.service';

describe('CatalogDataService', () => {
  const courseRow = {
    id: 'course-1',
    slug: 'calculus-1-complete-course',
    title: 'Calculus 1 Complete Course',
    subtitle: 'Limits, derivatives, and applications',
    teacher_name: 'MSS Faculty',
    academic_level: 'Honours 1st Year',
    subject: 'Mathematics',
    mode: 'recorded',
    level: 'beginner',
    access_type: 'paid',
    price_amount: 2500,
    discounted_price_amount: 1990,
    total_lessons: 36,
    total_quizzes: 12,
    duration_label: '12 weeks',
    thumbnail_url: null,
    tags: ['Calculus', 'Math'],
    is_featured: true,
    status: 'published',
    created_at: '2026-07-18T00:00:00Z',
    updated_at: '2026-07-18T00:00:00Z',
  };

  const packageRow = {
    id: 'package-1',
    slug: 'single-subject-course',
    title: 'Single Subject Course',
    subtitle: 'Focused subject preparation',
    type: 'single_subject',
    price_amount: 2500,
    discounted_price_amount: 1990,
    duration_label: '12 weeks',
    recommended_for: 'Students who need one focused course',
    features: ['Recorded lessons', 'Quizzes'],
    is_popular: true,
    cta_label: 'Enroll Now',
    status: 'published',
    created_at: '2026-07-18T00:00:00Z',
    updated_at: '2026-07-18T00:00:00Z',
  };

  function setup(options?: {
    data?: unknown[];
    singleData?: unknown | null;
    error?: { message: string } | null;
    configured?: boolean;
  }) {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: options?.singleData ?? null,
      error: options?.error ?? null,
    });

    const order = jest.fn().mockResolvedValue({
      data: options?.data ?? [],
      error: options?.error ?? null,
    });

    const eqSecond = jest.fn(() => ({ maybeSingle }));
    const eqFirst = jest.fn(() => ({
      eq: eqSecond,
      order,
    }));

    const select = jest.fn(() => ({
      eq: eqFirst,
    }));

    const from = jest.fn(() => ({
      select,
    }));

    TestBed.configureTestingModule({
      providers: [
        CatalogDataService,
        {
          provide: SupabaseClientService,
          useValue: {
            isConfigured: jest.fn(() => options?.configured ?? true),
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
      eqFirst,
      eqSecond,
      order,
      maybeSingle,
    };
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('reports whether Supabase is configured', () => {
    const { service } = setup({ configured: false });

    expect(service.isConfigured()).toBe(false);
  });

  it('loads published courses', async () => {
    const { service, from, eqFirst, order } = setup({ data: [courseRow] });

    const courses = await service.listPublishedCourses();

    expect(from).toHaveBeenCalledWith('courses');
    expect(eqFirst).toHaveBeenCalledWith('status', 'published');
    expect(order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(courses).toHaveLength(1);
    expect(courses[0].slug).toBe('calculus-1-complete-course');
  });

  it('loads one published course by slug', async () => {
    const { service, eqFirst, eqSecond, maybeSingle } = setup({ singleData: courseRow });

    const course = await service.getPublishedCourseBySlug('calculus-1-complete-course');

    expect(eqFirst).toHaveBeenCalledWith('slug', 'calculus-1-complete-course');
    expect(eqSecond).toHaveBeenCalledWith('status', 'published');
    expect(maybeSingle).toHaveBeenCalled();
    expect(course?.title).toBe('Calculus 1 Complete Course');
  });

  it('returns null when a course slug is not found', async () => {
    const { service } = setup({ singleData: null });

    await expect(service.getPublishedCourseBySlug('missing-course')).resolves.toBeNull();
  });

  it('loads published packages', async () => {
    const { service, from, eqFirst, order } = setup({ data: [packageRow] });

    const packages = await service.listPublishedPackages();

    expect(from).toHaveBeenCalledWith('course_packages');
    expect(eqFirst).toHaveBeenCalledWith('status', 'published');
    expect(order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(packages).toHaveLength(1);
    expect(packages[0].slug).toBe('single-subject-course');
  });

  it('loads one published package by slug', async () => {
    const { service, eqFirst, eqSecond, maybeSingle } = setup({ singleData: packageRow });

    const coursePackage = await service.getPublishedPackageBySlug('single-subject-course');

    expect(eqFirst).toHaveBeenCalledWith('slug', 'single-subject-course');
    expect(eqSecond).toHaveBeenCalledWith('status', 'published');
    expect(maybeSingle).toHaveBeenCalled();
    expect(coursePackage?.title).toBe('Single Subject Course');
  });

  it('throws readable course loading errors', async () => {
    const { service } = setup({
      error: { message: 'database unavailable' },
    });

    await expect(service.listPublishedCourses()).rejects.toThrow(
      'Course catalog loading failed: database unavailable'
    );
  });

  it('throws readable package loading errors', async () => {
    const { service } = setup({
      error: { message: 'database unavailable' },
    });

    await expect(service.listPublishedPackages()).rejects.toThrow(
      'Package catalog loading failed: database unavailable'
    );
  });
});
