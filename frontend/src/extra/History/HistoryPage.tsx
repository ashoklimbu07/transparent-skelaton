import { useEffect, useMemo, useState } from 'react';
import { Download, Eye, Trash2 } from 'lucide-react';
import { apiService, type HistoryItem } from '../../services/api.service';
import { ConfirmModal } from '../../tools/ManualStory/ConfirmModal';
import { WorkspaceLayout } from '../../workspace/WorkspaceLayout';

const TOOL_LABELS: Record<string, string> = {
  'broll.generate': 'Generate B-roll',
  'manual-story.generate': 'Manual Story',
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
      const matches = [
        ...trimmed.matchAll(
          /"(?:originalText|imagePrompt|visualPrompt|scene|prompt|text|segmentText)"\s*:\s*"((?:\\.|[^"])*)"/g,
        ),
      ];
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
    if (typeof objectValue.scene === 'string') {
      return [normalizePromptLine(objectValue.scene)].filter(Boolean);
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
            const brollPrompt = normalizePromptLine(row.scene);
            const segmentLabel = 'VIDEO SEGMENT';
            if (!originalText && !visualPrompt && !brollPrompt) return '';

            if (brollPrompt && !originalText && !visualPrompt) {
              return [
                `SCENE ${index + 1}`,
                '------------------',
                `B-ROLL PROMPT: ${brollPrompt}`,
              ].join('\n');
            }

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

type TimeFilter = 'all' | '24h' | 'day' | '7d';

function matchesTimeFilter(item: HistoryItem, timeFilter: TimeFilter): boolean {
  if (timeFilter === 'all') return true;

  const createdMs = new Date(item.createdAt).getTime();
  if (!Number.isFinite(createdMs)) return false;

  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  if (timeFilter === '24h') {
    return now - createdMs <= oneDay;
  }

  if (timeFilter === 'day') {
    const created = new Date(createdMs);
    const today = new Date(now);
    return (
      created.getFullYear() === today.getFullYear() &&
      created.getMonth() === today.getMonth() &&
      created.getDate() === today.getDate()
    );
  }

  return now - createdMs <= 7 * oneDay;
}

function HistoryListSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={`history-skeleton-${index}`} className="border border-[#242424] bg-[#171717] p-3">
          <div className="h-3 w-2/3 bg-[#242424]" />
          <div className="mt-2 h-3 w-1/2 bg-[#212121]" />
          <div className="mt-2 h-3 w-1/3 bg-[#1f1f1f]" />
          <div className="mt-2 h-3 w-3/4 bg-[#1c1c1c]" />
        </div>
      ))}
    </div>
  );
}

function HistoryDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 border-b border-[#242424] pb-3">
        <div className="h-3 w-1/3 bg-[#242424]" />
        <div className="mt-2 h-3 w-1/2 bg-[#212121]" />
        <div className="mt-2 h-3 w-1/4 bg-[#1f1f1f]" />
      </div>
      <div className="mb-3 h-3 w-20 bg-[#242424]" />
      <div className="h-[52vh] border border-[#252525] bg-[#111111] p-3">
        <div className="h-3 w-full bg-[#1d1d1d]" />
        <div className="mt-2 h-3 w-11/12 bg-[#1d1d1d]" />
        <div className="mt-2 h-3 w-10/12 bg-[#1d1d1d]" />
        <div className="mt-2 h-3 w-full bg-[#1d1d1d]" />
        <div className="mt-2 h-3 w-9/12 bg-[#1d1d1d]" />
      </div>
    </div>
  );
}

export function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [pendingDeleteHistoryId, setPendingDeleteHistoryId] = useState<string | null>(null);
  const [deletingHistoryId, setDeletingHistoryId] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [toolFilter, setToolFilter] = useState<string>('all');

  const availableTools = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.sourceTool))).sort((a, b) => formatLabel(a).localeCompare(formatLabel(b)));
  }, [items]);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (!matchesTimeFilter(item, timeFilter)) return false;
        if (toolFilter !== 'all' && item.sourceTool !== toolFilter) return false;
        return true;
      }),
    [items, timeFilter, toolFilter],
  );

  const selectedItem = useMemo(
    () => filteredItems.find((item) => item.historyId === selectedHistoryId) || filteredItems[0] || null,
    [filteredItems, selectedHistoryId],
  );
  const selectedSceneCount = useMemo(
    () => (selectedItem ? getSceneCount(selectedItem) : null),
    [selectedItem],
  );

  useEffect(() => {
    if (!selectedHistoryId && filteredItems.length > 0) {
      setSelectedHistoryId(filteredItems[0].historyId);
      return;
    }

    if (selectedHistoryId && !filteredItems.some((item) => item.historyId === selectedHistoryId)) {
      setSelectedHistoryId(filteredItems[0]?.historyId || null);
    }
  }, [filteredItems, selectedHistoryId]);

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

  const cancelDelete = () => {
    setPendingDeleteHistoryId(null);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteHistoryId || deletingHistoryId) return;

    setDeletingHistoryId(pendingDeleteHistoryId);
    setError(null);

    try {
      await apiService.deleteGenerationHistory(pendingDeleteHistoryId);
      setItems((prev) => prev.filter((item) => item.historyId !== pendingDeleteHistoryId));
      setSelectedHistoryId((prev) => (prev === pendingDeleteHistoryId ? null : prev));
      setPendingDeleteHistoryId(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete history item.');
    } finally {
      setDeletingHistoryId(null);
    }
  };

  return (
    <WorkspaceLayout>
      <section className="h-full w-full overflow-y-auto border border-[#222222] bg-[#111111] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6 md:p-8 lg:p-10">
        <div className="mb-5">
          <div>
            <h1 className="font-['Bebas_Neue'] text-[30px] tracking-[1px] text-[#f0ede8] sm:text-[36px]">History</h1>
            <p className="mt-1 text-sm text-[#8a8a8a]">View generated outputs from all tools with labels and download as TXT.</p>
          </div>
        </div>

        {error ? <p className="mb-4 border border-[#4a1f1f] bg-[#2a1414] px-3 py-2 text-sm text-[#ff8d8d]">{error}</p> : null}

        <div className="mb-4 grid grid-cols-1 gap-3 border border-[#242424] bg-[#131313] p-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[1.2px] text-[#9b9b9b]">Time</span>
            <select
              value={timeFilter}
              onChange={(event) => setTimeFilter(event.target.value as TimeFilter)}
              className="border border-[#2c2c2c] bg-[#191919] px-2 py-2 text-xs text-[#d0d0d0] focus:border-[#e8380d]/60 focus:outline-none"
            >
              <option value="all">All time</option>
              <option value="24h">Last 24 hrs</option>
              <option value="day">Today</option>
              <option value="7d">Last 7 days</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[1.2px] text-[#9b9b9b]">Tool</span>
            <select
              value={toolFilter}
              onChange={(event) => setToolFilter(event.target.value)}
              className="border border-[#2c2c2c] bg-[#191919] px-2 py-2 text-xs text-[#d0d0d0] focus:border-[#e8380d]/60 focus:outline-none"
            >
              <option value="all">All tools</option>
              {availableTools.map((tool) => (
                <option key={tool} value={tool}>
                  {formatLabel(tool)}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            {loading ? (
              <div className="h-3 w-28 animate-pulse bg-[#242424]" />
            ) : (
              <p className="text-xs text-[#9f9f9f]">
                Showing {filteredItems.length} of {items.length}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
          <aside className="max-h-[68vh] overflow-y-auto border border-[#242424] bg-[#131313] p-3">
            {loading ? <HistoryListSkeleton /> : null}
            {!loading && items.length === 0 ? <p className="text-sm text-[#8a8a8a]">No history yet.</p> : null}
            {!loading && items.length > 0 && filteredItems.length === 0 ? (
              <p className="text-sm text-[#8a8a8a]">No history matches current filters.</p>
            ) : null}
            <div className="space-y-2">
              {filteredItems.map((item) => {
                const isActive = selectedItem?.historyId === item.historyId;
                const sceneCount = getSceneCount(item);
                const isDeletingThisItem = deletingHistoryId === item.historyId;
                return (
                  <div
                    key={item.historyId}
                    className={`flex items-start gap-2 border p-2 transition-colors ${
                      isActive
                        ? 'border-[#e8380d]/70 bg-[#23150f]'
                        : 'border-[#242424] bg-[#171717] hover:border-[#e8380d]/35'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedHistoryId(item.historyId)}
                      className="min-w-0 flex-1 px-1 py-1 text-left"
                    >
                      <p className="text-[11px] uppercase tracking-[1.2px] text-[#ff9a7f]">{formatLabel(item.sourceTool)}</p>
                      <p className="mt-1 text-xs text-[#a3a3a3]">{new Date(item.createdAt).toLocaleString()}</p>
                      {sceneCount ? <p className="mt-1 text-xs text-[#c4c4c4]">Scenes: {sceneCount}</p> : null}
                      <p className="mt-1 truncate text-xs text-[#747474]">{item.historyId}</p>
                    </button>
                    <button
                      type="button"
                      disabled={isDeletingThisItem}
                      onClick={() => setPendingDeleteHistoryId(item.historyId)}
                      aria-label="Delete history item"
                      title="Delete history"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-[#432020] bg-[#271717] text-[#ff8d8d] transition-colors hover:border-[#ff6b6b] hover:text-[#ffc0c0] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </aside>

          <article className="min-h-[300px] border border-[#242424] bg-[#131313] p-4">
            {loading ? (
              <HistoryDetailsSkeleton />
            ) : !selectedItem ? (
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

      <ConfirmModal
        open={Boolean(pendingDeleteHistoryId)}
        title="Delete this output?"
        body="This history output will be permanently removed from your account and cannot be undone."
        cancelLabel="Cancel"
        confirmLabel={deletingHistoryId ? 'Deleting...' : 'Delete'}
        tone="danger"
        onCancel={cancelDelete}
        onConfirm={() => {
          void confirmDelete();
        }}
      />
    </WorkspaceLayout>
  );
}
