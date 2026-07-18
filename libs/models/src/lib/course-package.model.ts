export type PackageType =
  | 'single_subject'
  | 'full_year'
  | 'revision_batch'
  | 'free_demo';

export interface CoursePackage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  type: PackageType;
  priceLabel: string;
  discountedPriceLabel?: string;
  durationLabel: string;
  recommendedFor: string;
  features: string[];
  isPopular?: boolean;
  ctaLabel: string;
}
