export const environment = {
  production: false,
  supabase: {
    url: 'YOUR_SUPABASE_PROJECT_URL',
    anonKey: 'YOUR_SUPABASE_ANON_PUBLIC_KEY',
  },
  auth: {
    enableRouteGuards: false,
  },
} as const;
