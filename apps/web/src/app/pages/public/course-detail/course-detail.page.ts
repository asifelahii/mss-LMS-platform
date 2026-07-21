import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CatalogDataService } from '@mss-platform/data-access';
import { CourseCatalogItem } from '@mss-platform/models';

import { COURSE_CATALOG_ITEMS } from '../../../data/course-catalog.data';

@Component({
  selector: 'mss-course-detail-page',
  imports: [RouterLink],
  templateUrl: './course-detail.page.html',
  styleUrl: './course-detail.page.scss',
})
export class CourseDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogDataService = inject(CatalogDataService);

  protected readonly course = signal<CourseCatalogItem | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly dataNotice = signal('');

  ngOnInit(): void {
    void this.loadCourse();
  }

  protected learningOutcomes(course: CourseCatalogItem): string[] {
    if (course.subject === 'Physics') {
      return [
        'Understand core mechanics concepts from basic to exam level',
        'Solve numerical problems with structured steps',
        'Revise formulas with organized study materials',
        'Practice chapter-wise quizzes and model questions',
      ];
    }

    return [
      'Build strong mathematical foundations',
      'Understand chapter concepts through organized lessons',
      'Solve common National University exam-style problems',
      'Practice with quizzes, notes, and revision materials',
    ];
  }

  protected previewChapters(course: CourseCatalogItem): Array<{
    label: string;
    title: string;
    summary: string;
  }> {
    if (course.subject === 'Physics') {
      return [
        {
          label: 'Chapter 01',
          title: 'Motion and basic mechanics',
          summary: 'Concepts, formulas, and beginner-level numerical practice.',
        },
        {
          label: 'Chapter 02',
          title: 'Force, work, and energy',
          summary: 'Problem-solving approach for common academic questions.',
        },
        {
          label: 'Chapter 03',
          title: 'Rotation and revision',
          summary: 'Exam-focused revision with model-test practice.',
        },
      ];
    }

    return [
      {
        label: 'Chapter 01',
        title: 'Foundation and core concepts',
        summary: 'Start with the required theory and problem-solving basics.',
      },
      {
        label: 'Chapter 02',
        title: 'Important examples and applications',
        summary: 'Learn patterns commonly used in university-level exams.',
      },
      {
        label: 'Chapter 03',
        title: 'Revision, quiz, and model test',
        summary: 'Practice and review before moving to advanced chapters.',
      },
    ];
  }

  private async loadCourse(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.course.set(null);
      return;
    }

    const fallbackCourse = COURSE_CATALOG_ITEMS.find((courseItem) => courseItem.slug === slug) ?? null;

    if (!this.catalogDataService.isConfigured()) {
      this.course.set(fallbackCourse);
      this.dataNotice.set('Demo course detail is shown because Supabase is not configured yet.');
      return;
    }

    this.isLoading.set(true);
    this.dataNotice.set('');

    try {
      const course = await this.catalogDataService.getPublishedCourseBySlug(slug);
      this.course.set(course);
    } catch (error) {
      this.course.set(fallbackCourse);
      this.dataNotice.set(
        error instanceof Error
          ? `${error.message} Showing demo course detail for now.`
          : 'Course detail could not be loaded. Showing demo course detail for now.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
