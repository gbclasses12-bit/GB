export type PlatformId = string;

export interface PlatformItem {
  id: string;
  name: string;
  sidebarName: string;
  borderColor: string;
  glowColor: string;
  accentColor: string;
  url?: string;
  customIcon?: string;
  isCustom?: boolean;
  order?: number;
  updatedAt?: string;
}

export interface LectureItem {
  id: string;
  title: string;
  subject: string;
  duration: string;
  hasNotes: boolean;
  hasDpp: boolean;
}

export interface BatchItem {
  id: string;
  platformId: Exclude<PlatformId, 'home'>;
  title: string;
  subtitle?: string;
  classTag: string;
  category: 'new' | 'old';
  bannerBg: string;
  bannerAccent: string;
  badgeText?: string;
  lectures: LectureItem[];
}
