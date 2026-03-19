import type { ChangeEvent } from 'react';

export function normalizePromptText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n') // normalize newlines
    .trim()
    // collapse any run of 3+ newlines to exactly 2 (one blank line gap)
    .replace(/\n{3,}/g, '\n\n');
}

function downloadTextFile(opts: { normalizedText: string; filename: string }) {
  const blob = new Blob([opts.normalizedText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = opts.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadBrollJSON(args: {
  brollPromptsJson: string;
  brollPromptsPlain: string;
}) {
  // Download JSON-ish format (prompts separated by a single blank line)
  const normalizedText = normalizePromptText(args.brollPromptsJson || args.brollPromptsPlain);
  downloadTextFile({ normalizedText, filename: 'broll-prompts-json.txt' });
}

export function downloadBrollPlainText(args: {
  brollPromptsJson: string;
  brollPromptsPlain: string;
}) {
  // Download plain text format (human-readable)
  // Normalize line breaks so each prompt block is separated by exactly one blank line
  const normalizedText = normalizePromptText(args.brollPromptsPlain || args.brollPromptsJson);
  downloadTextFile({ normalizedText, filename: 'broll-prompts-text.txt' });
}

export function extractSceneBlocks(args: { brollPromptsJson: string; brollPromptsPlain: string }): string[] {
  // Prefer backend-reported total scenes; fall back to parsing text if needed
  const sceneBlocks = (args.brollPromptsJson || args.brollPromptsPlain || '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
  return sceneBlocks;
}

export function handleFileUpload(
  event: ChangeEvent<HTMLInputElement>,
  setScript: (value: string) => void,
) {
  const file = event.target.files?.[0];
  if (!file) return;

  // Check if it's a text file
  if (!file.type.startsWith('text/') && !file.name.endsWith('.txt')) {
    alert('Please upload a text file (.txt)');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    if (content) {
      setScript(content);
    }
  };
  reader.onerror = () => {
    alert('Error reading file. Please try again.');
  };
  reader.readAsText(file);

  // Reset the input so the same file can be selected again
  event.target.value = '';
}

