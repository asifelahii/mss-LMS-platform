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

  readonly client: SupabaseClient = createClient(
    this.config.url,
    this.config.anonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
}
