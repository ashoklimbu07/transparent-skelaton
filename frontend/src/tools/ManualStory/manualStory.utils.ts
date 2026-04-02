import type { ManualCharacter, ManualStoryStyle, ScenePrompt } from './manualStory.types';

export const CHARACTER_SLOTS = 5;
export const MAX_SCENES = 5;
export const MANUAL_STORY_STORAGE_KEY = 'manual-story-page-state-v1';

export function getDefaultCharacters(): ManualCharacter[] {
  return Array.from({ length: CHARACTER_SLOTS }, () => ({ enabled: false, detail: '' }));
}

export function loadPersistedState():
  | {
      characters: ManualCharacter[];
      scenesTextarea: string;
      promptsPlain: string;
      promptsByScene: ScenePrompt[];
      style: ManualStoryStyle;
    }
  | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(MANUAL_STORY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<{
      characters: ManualCharacter[];
      scenesTextarea: string;
      promptsPlain: string;
      promptsByScene: ScenePrompt[];
      style: ManualStoryStyle;
    }>;

    const safeCharacters = Array.isArray(parsed.characters)
      ? parsed.characters.slice(0, CHARACTER_SLOTS).map((c) => ({
          enabled: Boolean(c?.enabled),
          detail: typeof c?.detail === 'string' ? c.detail : '',
        }))
      : getDefaultCharacters();
    while (safeCharacters.length < CHARACTER_SLOTS) {
      safeCharacters.push({ enabled: false, detail: '' });
    }

    const safePromptsByScene = Array.isArray(parsed.promptsByScene)
      ? parsed.promptsByScene
          .filter((p) => typeof p?.sceneIndex === 'number' && typeof p?.imagePrompt === 'string')
          .map((p) => ({ sceneIndex: p.sceneIndex, imagePrompt: p.imagePrompt }))
      : [];

    return {
      characters: safeCharacters,
      scenesTextarea: typeof parsed.scenesTextarea === 'string' ? parsed.scenesTextarea : '',
      promptsPlain: typeof parsed.promptsPlain === 'string' ? parsed.promptsPlain : '',
      promptsByScene: safePromptsByScene,
      style: parsed.style === 'photorealistic' ? 'photorealistic' : 'cinematic-35mm',
    };
  } catch {
    return null;
  }
}

export function downloadTextFile(opts: { text: string; filename: string }) {
  const blob = new Blob([opts.text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = opts.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function normalizeInputNewlines(text: string): string {
  return text.replace(/\r\n/g, '\n');
}

export function formatScenePromptJson(scenePrompt: ScenePrompt): string {
  return JSON.stringify(
    {
      sceneIndex: scenePrompt.sceneIndex,
      imagePrompt: scenePrompt.imagePrompt,
    },
    null,
    2,
  );
}

export function parseScenesFromTextarea(raw: string): string[] {
  const text = normalizeInputNewlines(raw).trim();
  if (!text) return [];

  const sceneHeaderRegex = /scene\s*(\d+)\s*[:\-]/gi;
  const headerMatches = Array.from(text.matchAll(sceneHeaderRegex));

  if (headerMatches.length > 0) {
    const scenes: Array<{ index: number; value: string }> = [];
    for (let i = 0; i < headerMatches.length; i += 1) {
      const match = headerMatches[i]!;
      const index = Number(match[1]);
      const start = match.index ?? 0;
      const end = headerMatches[i + 1]?.index ?? text.length;
      const value = text
        .slice(start, end)
        .replace(/scene\s*\d+\s*[:\-]/i, '')
        .trim();

      if (!Number.isNaN(index) && value) {
        scenes.push({ index, value });
      }
    }

    scenes.sort((a, b) => a.index - b.index);
    return scenes
      .slice(0, MAX_SCENES)
      .map((s) => s.value)
      .filter((s) => s.trim().length > 0);
  }

  return text
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_SCENES);
}

export function findReferencedCharacters(sceneText: string): Array<'c1' | 'c2' | 'c3' | 'c4' | 'c5'> {
  const normalized = normalizeInputNewlines(sceneText);
  const re = /\bc([1-5])\b/gi;
  const matches = Array.from(normalized.matchAll(re));
  const set = new Set<string>();
  for (const m of matches) {
    const n = m[1];
    if (n) set.add(`c${n}`);
  }
  return Array.from(set).map((s) => s.toLowerCase()) as Array<'c1' | 'c2' | 'c3' | 'c4' | 'c5'>;
}
