import { useEffect, useMemo, useRef, useState } from 'react';
import { apiService } from '../../services/api.service';
import { WorkspaceLayout } from '../../workspace/WorkspaceLayout';
import { CharactersSection } from './CharactersSection';
import { ConfirmModal } from './ConfirmModal';
import { GenerateActions } from './GenerateActions';
import { PromptsSection } from './PromptsSection';
import { ScenesSection } from './ScenesSection';
import { StyleSection } from './StyleSection';
import type { ManualCharacter, ManualStoryStyle, ScenePrompt } from './manualStory.types';
import {
  MANUAL_STORY_STORAGE_KEY,
  MAX_SCENES,
  downloadTextFile,
  findReferencedCharacters,
  getDefaultCharacters,
  loadPersistedState,
  parseScenesFromTextarea,
} from './manualStory.utils';

export function ManualStoryPage() {
  const persisted = loadPersistedState();

  const [characters, setCharacters] = useState<ManualCharacter[]>(() => persisted?.characters ?? getDefaultCharacters());
  const [scenesTextarea, setScenesTextarea] = useState(() => persisted?.scenesTextarea ?? '');
  const [error, setError] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [promptsPlain, setPromptsPlain] = useState<string>(() => persisted?.promptsPlain ?? '');
  const [promptsByScene, setPromptsByScene] = useState<ScenePrompt[]>(() => persisted?.promptsByScene ?? []);
  const [style, setStyle] = useState<ManualStoryStyle>(() => persisted?.style ?? 'cinematic-35mm');
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const enabledCharacterMap = useMemo(() => {
    const map: Record<string, string> = {};
    characters.forEach((c, idx) => {
      if (!c.enabled) return;
      const trimmed = c.detail.trim();
      if (!trimmed) return;
      map[`c${idx + 1}`] = trimmed;
    });
    return map;
  }, [characters]);

  const enabledCharacterCount = Object.keys(enabledCharacterMap).length;
  const enabledSlotsCount = useMemo(() => characters.filter((c) => c.enabled).length, [characters]);

  const scenesPreview = useMemo(() => parseScenesFromTextarea(scenesTextarea), [scenesTextarea]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        MANUAL_STORY_STORAGE_KEY,
        JSON.stringify({
          characters,
          scenesTextarea,
          promptsPlain,
          promptsByScene,
          style,
        }),
      );
    } catch {
      // Ignore storage quota / private mode errors.
    }
  }, [characters, scenesTextarea, promptsPlain, promptsByScene, style]);

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  const handleCopyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 1400);
    } catch {
      setError('Failed to copy text. Please copy manually.');
    }
  };

  const handleGenerate = async (skipExistingCheck = false) => {
    if (isGenerating) return;
    setError(null);

    const scenes = parseScenesFromTextarea(scenesTextarea);
    if (enabledCharacterCount === 0) {
      setError('Please add at least one character (c1..c5).');
      return;
    }
    if (scenes.length === 0) {
      setError('Please enter at least one scene in the textarea.');
      return;
    }

    const sceneIndices = scenes.map((s) => s.sceneIndex);
    if (new Set(sceneIndices).size !== sceneIndices.length) {
      setError('Each scene number must be unique (duplicate Scene N labels detected).');
      return;
    }

    const referenced = findReferencedCharacters(scenesTextarea);
    const missing = referenced.filter((id) => !enabledCharacterMap[id]);
    if (missing.length > 0) {
      setError(`Scene references ${missing.join(', ')} but those characters are not enabled/filled.`);
      return;
    }

    if (scenes.length > MAX_SCENES) {
      setError(`Please provide up to ${MAX_SCENES} scenes.`);
      return;
    }

    if (!skipExistingCheck && (promptsByScene.length > 0 || promptsPlain.trim().length > 0)) {
      setShowRegenerateModal(true);
      return;
    }

    setPromptsPlain('');
    setPromptsByScene([]);

    const abortController = new AbortController();
    abortRef.current = abortController;
    setIsGenerating(true);

    try {
      const resp = await apiService.generateManualStoryPrompts({
        characters: enabledCharacterMap,
        scenes,
        style,
        signal: abortController.signal,
      });

      setPromptsPlain(resp.promptsPlain);
      setPromptsByScene(resp.promptsByScene);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setError('Cancelled.');
        return;
      }
      setError(e instanceof Error ? e.message : 'Failed to generate manual story prompts');
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  };

  const canGenerate = !isGenerating && enabledCharacterCount > 0 && parseScenesFromTextarea(scenesTextarea).length > 0;

  return (
    <WorkspaceLayout>
      <section className="h-full w-full overflow-y-auto border border-[#222222] bg-[#111111] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6 md:p-8 lg:p-10">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-['Bebas_Neue'] text-[28px] tracking-[1px] sm:text-[36px] lg:text-[40px]">
              Manual Story Scene Builder
            </h1>
            <p className="mt-2 text-xls leading-5 text-[#8a8a8a]">
              Add up to 5 characters, write up to 5 scenes, and generate scene-wise plus full combined B-roll prompts.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <CharactersSection
            characters={characters}
            isGenerating={isGenerating}
            enabledSlotsCount={enabledSlotsCount}
            onResetAll={() => {
              setCharacters(getDefaultCharacters());
              setError(null);
            }}
            onEnableSlot={(index) => {
              setCharacters((prev) => prev.map((p, i) => (i === index ? { ...p, enabled: true } : p)));
            }}
            onDisableSlot={(index) => {
              setCharacters((prev) => prev.map((p, i) => (i === index ? { enabled: false, detail: '' } : p)));
            }}
            onChangeDetail={(index, detail) => {
              setCharacters((prev) => prev.map((p, i) => (i === index ? { ...p, detail } : p)));
            }}
          />
          <div className="text-xs text-[#888888]">
            {enabledCharacterCount > 0 ? `Characters Used : ${enabledCharacterCount}` : 'Add characters to begin.'}
          </div>

          <StyleSection style={style} isGenerating={isGenerating} onChangeStyle={setStyle} />

          <ScenesSection
            scenesTextarea={scenesTextarea}
            scenesPreviewCount={scenesPreview.length}
            isGenerating={isGenerating}
            onChangeScenesTextarea={setScenesTextarea}
            onClear={() => {
              setScenesTextarea('');
              setError(null);
            }}
          />

          <GenerateActions
            error={error}
            isGenerating={isGenerating}
            canGenerate={canGenerate}
            onCancel={handleCancel}
            onGenerate={() => {
              void handleGenerate();
            }}
          />

          <PromptsSection
            promptsByScene={promptsByScene}
            promptsPlain={promptsPlain}
            copiedKey={copiedKey}
            onDeletePrompts={() => {
              setShowDeleteModal(true);
            }}
            onDownloadAll={() => {
              downloadTextFile({ text: promptsPlain, filename: 'manual-story-prompts.txt' });
            }}
            onCopyText={(text, key) => {
              void handleCopyText(text, key);
            }}
          />

          <ConfirmModal
            open={showRegenerateModal}
            title="Warning"
            body="You already generated B-roll. Delete it or download it first. Do you want to generate again?"
            cancelLabel="No"
            confirmLabel="Yes, Generate"
            onCancel={() => setShowRegenerateModal(false)}
            onConfirm={() => {
              setShowRegenerateModal(false);
              void handleGenerate(true);
            }}
          />

          <ConfirmModal
            open={showDeleteModal}
            title="Delete Prompts?"
            body="Delete all generated prompts? This action cannot be undone."
            cancelLabel="Cancel"
            confirmLabel="Yes, Delete"
            tone="danger"
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={() => {
              setShowDeleteModal(false);
              setPromptsByScene([]);
              setPromptsPlain('');
            }}
          />
        </div>
      </section>
    </WorkspaceLayout>
  );
}
