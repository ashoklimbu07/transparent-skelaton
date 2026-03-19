export function normalizePromptBlocks(text: string): string {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .trim()
    // ensure exactly one blank line (two \n) between blocks
    .replace(/\n{3,}/g, '\n\n');
}

