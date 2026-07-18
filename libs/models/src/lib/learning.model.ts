export type MaterialType = 'pdf' | 'slide' | 'image' | 'doc' | 'link';
export type VideoProvider = 'youtube_unlisted' | 'cloudflare_stream' | 'bunny_stream';

export interface LessonMaterial {
  id: string;
  lessonId: string;
  title: string;
  type: MaterialType;
  storagePath?: string | null;
  externalUrl?: string | null;
  orderNo: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoAsset {
  id: string;
  lessonId?: string | null;
  provider: VideoProvider;
  providerVideoId: string;
  title?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlaybackSession {
  id: string;
  studentId: string;
  lessonId: string;
  deviceId?: string | null;
  startedAt: string;
  endedAt?: string | null;
  lastPositionSeconds?: number;
}
