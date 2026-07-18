export const MSS_STORAGE_BUCKETS = {
  courseThumbnails: 'course-thumbnails',
  lessonMaterials: 'lesson-materials',
  paymentProofs: 'payment-proofs',
  profileAvatars: 'profile-avatars',
} as const;

export type MssStorageBucket =
  (typeof MSS_STORAGE_BUCKETS)[keyof typeof MSS_STORAGE_BUCKETS];

export function buildUserFolderPath(userId: string, fileName: string): string {
  return `${userId}/${fileName}`;
}
