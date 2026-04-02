function stripCodeFences(text: string): string {
  return text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
}

function extractJsonCandidate(text: string): string {
  const startObject = text.indexOf('{');
  const startArray = text.indexOf('[');
  const startCandidates = [startObject, startArray].filter((idx) => idx >= 0);
  const start = startCandidates.length > 0 ? Math.min(...startCandidates) : 0;

  const endObject = text.lastIndexOf('}');
  const endArray = text.lastIndexOf(']');
  const end = Math.max(endObject, endArray);

  if (end > start) {
    return text.slice(start, end + 1).trim();
  }
  return text.trim();
}

function normalizeQuotes(text: string): string {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

function removeTrailingCommas(text: string): string {
  return text.replace(/,\s*([\]}])/g, '$1');
}

export function safeParseJSON<T>(rawText: string): T {
  const cleaned = extractJsonCandidate(stripCodeFences(rawText));

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const fixed = removeTrailingCommas(normalizeQuotes(cleaned));
    try {
      return JSON.parse(fixed) as T;
    } catch {
      const preview = rawText.slice(0, 300);
      throw new Error(`Failed to parse JSON response. Raw preview: ${preview}`);
    }
  }
}
