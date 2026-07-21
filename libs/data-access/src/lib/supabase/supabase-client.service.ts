import { inject, Injectable, InjectionToken } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const SUPABASE_CONFIG = new InjectionToken<SupabaseConfig>('SUPABASE_CONFIG');

@Injectable({
  providedIn: 'root',
})
export class SupabaseClientService {
  private readonly config = inject(SUPABASE_CONFIG);
  private clientInstance: SupabaseClient | null = null;

  get client(): SupabaseClient {
    if (!this.isConfigured()) {
      throw new Error(
        'Supabase is not configured yet. Add your Supabase URL and anon key before using auth or database features.'
      );
    }

    this.clientInstance ??= createClient(this.config.url, this.config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    return this.clientInstance;
  }

  isConfigured(): boolean {
    return Boolean(this.config.url?.trim() && this.config.anonKey?.trim());
  }
}
