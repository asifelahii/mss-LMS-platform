import { inject, Injectable } from '@angular/core';

import { CourseCatalogItem, CoursePackage } from '@mss-platform/models';

import { DbCoursePackageRow, DbCourseRow } from '../database/database-row.types';
import { SupabaseClientService } from '../supabase/supabase-client.service';
import { mapCourseRowToCatalogItem, mapPackageRowToCoursePackage } from './catalog.mappers';

@Injectable({
  providedIn: 'root',
})
export class CatalogDataService {
  private readonly supabaseClient = inject(SupabaseClientService).client;

  async listPublishedCourses(): Promise<CourseCatalogItem[]> {
    const { data, error } = await this.supabaseClient
      .from('courses')
      .select('*')
      .eq('status', 'published')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to load courses: ${error.message}`);
    }

    return ((data ?? []) as DbCourseRow[]).map(mapCourseRowToCatalogItem);
  }

  async getPublishedCourseBySlug(slug: string): Promise<CourseCatalogItem | null> {
    const { data, error } = await this.supabaseClient
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load course: ${error.message}`);
    }

    return data ? mapCourseRowToCatalogItem(data as DbCourseRow) : null;
  }

  async listPublishedPackages(): Promise<CoursePackage[]> {
    const { data, error } = await this.supabaseClient
      .from('course_packages')
      .select('*')
      .eq('status', 'published')
      .order('is_popular', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to load packages: ${error.message}`);
    }

    return ((data ?? []) as DbCoursePackageRow[]).map(mapPackageRowToCoursePackage);
  }

  async getPublishedPackageBySlug(slug: string): Promise<CoursePackage | null> {
    const { data, error } = await this.supabaseClient
      .from('course_packages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load package: ${error.message}`);
    }

    return data ? mapPackageRowToCoursePackage(data as DbCoursePackageRow) : null;
  }
}
