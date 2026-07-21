import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { SUPABASE_CONFIG } from './supabase-config.token';

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
