import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CourseCatalogItem } from '@mss-platform/models';

@Component({
  selector: 'mss-course-card',
  imports: [RouterLink],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
})
export class CourseCardComponent {
  @Input({ required: true }) course!: CourseCatalogItem;
}
