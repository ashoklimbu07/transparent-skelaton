import { useEffect, useMemo, useState } from 'react';
import { Download, Eye, RefreshCw } from 'lucide-react';
import { apiService, type HistoryItem } from '../../services/api.service';
import { WorkspaceLayout } from '../../workspace/WorkspaceLayout';

const TOOL_LABELS: Record<string, string> = {
  'broll.generate': 'Generate B-roll',
  'manual-story.generate': 'Manual Story',
  'video-scene-analyzer.analyze-script': 'Video Scene Analyzer (Script)',
  'video-scene-analyzer.analyze-video': 'Video Scene Analyzer (Video)',
  'video-scene-analyzer.regenerate-visual-prompt': 'Visual Prompt Regeneration',
  'video-scene-analyzer.generate-image': 'Image Generation',
  'video-scene-analyzer.generate-video': 'Video Generation',
};

function formatLabel(sourceTool: string): string {
  return TOOL_LABELS[sourceTool] || sourceTool;
}

function toPrettyJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function normalizePromptLine(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function extractPromptLinesFromUnknown(value: unknown): string[] {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      return extractPromptLinesFromUnknown(JSON.parse(trimmed));
    } catch {
      const matches = [...trimmed.matchAll(/"(?:originalText|imagePrompt)"\s*:\s*"((?:\\.|[^"])*)"/g)];
      if (matches.length > 0) {
        return matches
          .map((match) => {
            const escaped = match[1] ?? '';
            try {
              return JSON.parse(`"${escaped}"`);
            } catch {
              return escaped.replace(/\\"/g, '"');
            }
          })
          .map(normalizePromptLine)
          .filter(Boolean);
      }
      return [normalizePromptLine(trimmed)].filter(Boolean);
    }
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => extractPromptLinesFromUnknown(entry));
  }

  if (value && typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;

    if (typeof objectValue.originalText === 'string') {
      return [normalizePromptLine(objectValue.originalText)].filter(Boolean);
    }
    if (typeof objectValue.text === 'string') {
      return [normalizePromptLine(objectValue.text)].filter(Boolean);
    }
    if (typeof objectValue.prompt === 'string') {
      return [normalizePromptLine(objectValue.prompt)].filter(Boolean);
    }
    if (typeof objectValue.imagePrompt === 'string') {
      return [normalizePromptLine(objectValue.imagePrompt)].filter(Boolean);
    }
    if (typeof objectValue.segmentText === 'string') {
      return [normalizePromptLine(objectValue.segmentText)].filter(Boolean);
    }

    if (Array.isArray(objectValue.scenes)) {
      return objectValue.scenes.flatMap((scene) => extractPromptLinesFromUnknown(scene));
    }

    if (Array.isArray(objectValue.promptsByScene)) {
      return objectValue.promptsByScene.flatMap((prompt) => extractPromptLinesFromUnknown(prompt));
    }
  }

  return [];
}

function uniquePromptLines(lines: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const line of lines) {
    if (!line || seen.has(line)) continue;
    seen.add(line);
    unique.push(line);
  }
  return unique;
}

function buildPromptLines(item: HistoryItem): string[] {
  if (item.sourceTool === 'manual-story.generate') {
    const manualOutput = item.output as Record<string, unknown> | undefined;
    const fromImagePrompts = Array.isArray(manualOutput?.promptsByScene)
      ? manualOutput.promptsByScene
          .map((entry) => {
            if (!entry || typeof entry !== 'object') return '';
            return normalizePromptLine((entry as Record<string, unknown>).imagePrompt);
          })
          .filter(Boolean)
      : [];
    const fromCombined = extractPromptLinesFromUnknown(item.combinedOutput);
    return uniquePromptLines([...fromImagePrompts, ...fromCombined]);
  }

  const fromOutput = extractPromptLinesFromUnknown(item.output);
  const fromInput = extractPromptLinesFromUnknown(item.input);
  const fromCombined = extractPromptLinesFromUnknown(item.combinedOutput);
  return uniquePromptLines([...fromOutput, ...fromInput, ...fromCombined]);
}

function buildHistoryText(item: HistoryItem): string {
  const promptLines = buildPromptLines(item);
  if (promptLines.length > 0) {
    return promptLines.join('\n\n');
  }

  return toPrettyJson(item.output ?? {});
}

function asPositiveInteger(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }
  return null;
}

function parseCombinedOutputAsArray(item: HistoryItem): unknown[] | null {
  const combinedOutput = typeof item.combinedOutput === 'string' ? item.combinedOutput.trim() : '';
  if (!combinedOutput) return null;

  try {
    const parsed = JSON.parse(combinedOutput) as unknown;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getSceneCount(item: HistoryItem): number | null {
  const combinedArray = parseCombinedOutputAsArray(item);
  if (combinedArray && combinedArray.length > 0) {
    return combinedArray.length;
  }

  const output = item.output && typeof item.output === 'object' ? (item.output as Record<string, unknown>) : null;
  if (output) {
    const fromTotalScenes = asPositiveInteger(output.totalScenes);
    if (fromTotalScenes) return fromTotalScenes;

    const fromSceneCount = asPositiveInteger(output.sceneCount);
    if (fromSceneCount) return fromSceneCount;

    if (Array.isArray(output.scenes) && output.scenes.length > 0) {
      return output.scenes.length;
    }

    if (Array.isArray(output.promptsByScene) && output.promptsByScene.length > 0) {
      return output.promptsByScene.length;
    }
  }

  const promptLines = buildPromptLines(item);
  return promptLines.length > 0 ? promptLines.length : null;
}

function buildDownloadText(item: HistoryItem): string {
  const combinedOutput = typeof item.combinedOutput === 'string' ? item.combinedOutput.trim() : '';
  if (combinedOutput) {
    try {
      const parsed = JSON.parse(combinedOutput) as unknown;
      if (Array.isArray(parsed)) {
        const sceneBlocks = parsed
          .map((entry, index) => {
            if (!entry || typeof entry !== 'object') return '';
            const row = entry as Record<string, unknown>;
            const originalText = normalizePromptLine(row.originalText);
            const visualPrompt = normalizePromptLine(row.visualPrompt);
            const segmentLabel =
              item.sourceTool === 'video-scene-analyzer.analyze-video' ? 'VIDEO SEGMENT' : 'SCRIPT SEGMENT';
            if (!originalText && !visualPrompt) return '';

            return [
              `SCENE ${index + 1}`,
              '------------------',
              `${segmentLabel}: "${originalText}"`,
              `VISUAL PROMPT: ${visualPrompt}`,
            ].join('\n');
          })
          .filter(Boolean);

        if (sceneBlocks.length > 0) {
          return sceneBlocks.join('\n\n');
        }
      }
    } catch {
      // Keep raw combinedOutput flow below when not JSON.
    }

    return combinedOutput
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n');
  }
  return toPrettyJson(item.output ?? {});
}

function downloadAsText(item: HistoryItem) {
  const text = buildDownloadText(item);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = `${item.historyId}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}

export function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const selectedItem = useMemo(
    () => items.find((item) => item.historyId === selectedHistoryId) || items[0] || null,
    [items, selectedHistoryId],
  );
  const selectedSceneCount = useMemo(
    () => (selectedItem ? getSceneCount(selectedItem) : null),
    [selectedItem],
  );

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const historyItems = await apiService.getGenerationHistory(100);
      setItems(historyItems);
      setSelectedHistoryId((prev) => prev || historyItems[0]?.historyId || null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <WorkspaceLayout>
      <section className="h-full w-full overflow-y-auto border border-[#222222] bg-[#111111] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6 md:p-8 lg:p-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-['Bebas_Neue'] text-[30px] tracking-[1px] text-[#f0ede8] sm:text-[36px]">History</h1>
            <p className="mt-1 text-sm text-[#8a8a8a]">View generated outputs from all tools with labels and download as TXT.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              void load();
            }}
            className="inline-flex items-center gap-2 border border-[#2c2c2c] bg-[#191919] px-3 py-2 text-xs text-[#d0d0d0] hover:border-[#e8380d]/60"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {error ? <p className="mb-4 border border-[#4a1f1f] bg-[#2a1414] px-3 py-2 text-sm text-[#ff8d8d]">{error}</p> : null}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
          <aside className="max-h-[68vh] overflow-y-auto border border-[#242424] bg-[#131313] p-3">
            {loading ? <p className="text-sm text-[#8a8a8a]">Loading history...</p> : null}
            {!loading && items.length === 0 ? <p className="text-sm text-[#8a8a8a]">No history yet.</p> : null}
            <div className="space-y-2">
              {items.map((item) => {
                const isActive = selectedItem?.historyId === item.historyId;
                const sceneCount = getSceneCount(item);
                return (
                  <button
                    key={item.historyId}
                    type="button"
                    onClick={() => setSelectedHistoryId(item.historyId)}
                    className={`w-full border px-3 py-3 text-left transition-colors ${
                      isActive
                        ? 'border-[#e8380d]/70 bg-[#23150f]'
                        : 'border-[#242424] bg-[#171717] hover:border-[#e8380d]/35'
                    }`}
                  >
                    <p className="text-[11px] uppercase tracking-[1.2px] text-[#ff9a7f]">{formatLabel(item.sourceTool)}</p>
                    <p className="mt-1 text-xs text-[#a3a3a3]">{new Date(item.createdAt).toLocaleString()}</p>
                    {sceneCount ? <p className="mt-1 text-xs text-[#c4c4c4]">Scenes: {sceneCount}</p> : null}
                    <p className="mt-1 truncate text-xs text-[#747474]">{item.historyId}</p>
                  </button>
                );
              })}
            </div>
          </aside>

          <article className="min-h-[300px] border border-[#242424] bg-[#131313] p-4">
            {!selectedItem ? (
              <p className="text-sm text-[#8a8a8a]">Select a history item to view details.</p>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#242424] pb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[1.4px] text-[#ff9a7f]">{formatLabel(selectedItem.sourceTool)}</p>
                    <p className="text-xs text-[#8a8a8a]">Created: {new Date(selectedItem.createdAt).toLocaleString()}</p>
                    {selectedSceneCount ? <p className="text-xs text-[#bdbdbd]">Total scenes: {selectedSceneCount}</p> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => downloadAsText(selectedItem)}
                      className="inline-flex items-center gap-1.5 border border-[#2c2c2c] bg-[#1b1b1b] px-3 py-1.5 text-xs text-[#d0d0d0] hover:border-[#e8380d]/60"
                    >
                      <Download size={14} />
                      Download TXT
                    </button>
                  </div>
                </div>

                <div className="mb-3 inline-flex items-center gap-2 text-xs text-[#a5a5a5]">
                  <Eye size={14} />
                  View
                </div>
                <pre className="max-h-[52vh] overflow-auto whitespace-pre-wrap border border-[#252525] bg-[#111111] p-3 text-xs leading-5 text-[#d6d6d6]">
                  {buildHistoryText(selectedItem)}
                </pre>
              </>
            )}
          </article>
        </div>
      </section>
    </WorkspaceLayout>
  );
}
