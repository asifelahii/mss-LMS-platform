import { inject, Injectable } from '@angular/core';

import { CourseCatalogItem, CoursePackage } from '@mss-platform/models';

import { SupabaseClientService } from '../supabase/supabase-client.service';
import {
  DbCoursePackageRow,
  DbCourseRow,
} from '../database/database-row.types';
import {
  mapCourseRowToCatalogItem,
  mapPackageRowToCoursePackage,
} from './catalog.mappers';

@Injectable({
  providedIn: 'root',
})
export class CatalogDataService {
  private readonly supabase = inject(SupabaseClientService);

  isConfigured(): boolean {
    return this.supabase.isConfigured();
  }

  async listAllCourses(): Promise<CourseCatalogItem[]> {
    const { data, error } = await this.supabase.client
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Course loading failed: ${error.message}`);
    }

    return ((data ?? []) as DbCourseRow[]).map(mapCourseRowToCatalogItem);
  }

  async listPublishedCourses(): Promise<CourseCatalogItem[]> {
    const { data, error } = await this.supabase.client
      .from('courses')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Course catalog loading failed: ${error.message}`);
    }

    return ((data ?? []) as DbCourseRow[]).map(mapCourseRowToCatalogItem);
  }

  async getPublishedCourseBySlug(
    slug: string,
  ): Promise<CourseCatalogItem | null> {
    const { data, error } = await this.supabase.client
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      throw new Error(`Course detail loading failed: ${error.message}`);
    }

    return data ? mapCourseRowToCatalogItem(data as DbCourseRow) : null;
  }

  async listPublishedPackages(): Promise<CoursePackage[]> {
    const { data, error } = await this.supabase.client
      .from('course_packages')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Package catalog loading failed: ${error.message}`);
    }

    return ((data ?? []) as DbCoursePackageRow[]).map(
      mapPackageRowToCoursePackage,
    );
  }

  async getPublishedPackageBySlug(slug: string): Promise<CoursePackage | null> {
    const { data, error } = await this.supabase.client
      .from('course_packages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      throw new Error(`Package detail loading failed: ${error.message}`);
    }

    return data
      ? mapPackageRowToCoursePackage(data as DbCoursePackageRow)
      : null;
  }
}
