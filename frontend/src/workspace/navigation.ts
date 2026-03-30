import type { LucideIcon } from 'lucide-react';
import { Eraser, FileText, History, Library, Palette, Search, Settings, Sparkles } from 'lucide-react';

export type WorkspaceNavItem = {
  icon: LucideIcon;
  label: string;
  path: string;
};

export const toolsNavItems: WorkspaceNavItem[] = [
  { icon: Sparkles, label: 'Generate B-roll', path: '/tools/generate' },
  { icon: Search, label: 'Video Scene Analyzer', path: '/tools/video-scene-analyzer' },
  { icon: FileText, label: 'Script Writer', path: '/tools/script-writer' },
  { icon: Eraser, label: 'Prompt Cleaner', path: '/tools/prompt-cleaner' },
];

export const extraNavItems: WorkspaceNavItem[] = [
  { icon: History, label: 'History', path: '/extra/history' },
  { icon: Library, label: 'Media Library', path: '/extra/media-library' },
];

export const accountNavItems: WorkspaceNavItem[] = [
  { icon: Palette, label: 'Theme', path: '/account/theme' },
  { icon: Settings, label: 'Settings', path: '/account/settings' },
];
