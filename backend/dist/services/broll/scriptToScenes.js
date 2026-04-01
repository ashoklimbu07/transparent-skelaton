/**
 * Split a raw script into scene-like chunks (deterministic, no AI formatting step).
 */
function buildNearEvenWordChunks(words, target) {
    if (target <= 0)
        return [];
    if (words.length === 0)
        return [];
    if (words.length < target) {
        // Extremely short scripts: keep chunks non-empty by cycling words.
        return Array.from({ length: target }, (_, i) => words[i % words.length] ?? '').filter(Boolean);
    }
    const chunks = [];
    for (let i = 0; i < target; i += 1) {
        const start = Math.floor((i * words.length) / target);
        const end = Math.floor(((i + 1) * words.length) / target);
        chunks.push(words.slice(start, end).join(' ').trim());
    }
    return chunks.filter(Boolean);
}
export function scriptToScenes(script, maxScenes = 35, minScenes = 20) {
    const normalized = script
        .replace(/\r\n/g, '\n')
        .replace(/\t/g, ' ')
        .trim();
    if (!normalized)
        return {};
    // Prefer splitting by blank lines first (author-intent), then by sentence boundaries.
    const blocks = normalized
        .split(/\n{2,}/g)
        .map((b) => b.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
    const sentences = [];
    for (const block of blocks) {
        const parts = block
            .split(/(?<=[.!?])\s+/g)
            .map((p) => p.trim())
            .filter(Boolean);
        if (parts.length > 0) {
            sentences.push(...parts);
        }
        else {
            sentences.push(block);
        }
    }
    let trimmed = sentences
        .map((s) => s.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
    // If we still don't have enough scenes, chunk by word count.
    // This ensures we can reliably generate the requested minimum overall.
    if (trimmed.length < minScenes) {
        const parts = normalized
            .split(/(?<=[.!?])\s+/g)
            .map((p) => p.trim())
            .filter(Boolean);
        if (parts.length >= minScenes) {
            trimmed = parts;
        }
        else {
            const words = normalized.split(/\s+/).filter(Boolean);
            const target = Math.max(1, minScenes);
            trimmed = buildNearEvenWordChunks(words, target);
        }
    }
    const exactRequested = minScenes === maxScenes ? minScenes : null;
    if (exactRequested !== null && exactRequested > 0) {
        // Force exact scene count when caller requests a fixed amount.
        if (trimmed.length > exactRequested) {
            const merged = [];
            for (let i = 0; i < exactRequested; i += 1) {
                const start = Math.floor((i * trimmed.length) / exactRequested);
                const end = Math.floor(((i + 1) * trimmed.length) / exactRequested);
                const segment = trimmed.slice(start, end).join(' ').trim();
                if (segment)
                    merged.push(segment);
            }
            trimmed = merged;
        }
        else if (trimmed.length < exactRequested) {
            const words = normalized.split(/\s+/).filter(Boolean);
            const expanded = buildNearEvenWordChunks(words, exactRequested);
            if (expanded.length > 0) {
                trimmed = expanded;
            }
        }
    }
    else {
        trimmed = trimmed.slice(0, maxScenes);
    }
    const scenes = {};
    trimmed.forEach((text, idx) => {
        scenes[`scene_${idx + 1}`] = text;
    });
    return scenes;
}
//# sourceMappingURL=scriptToScenes.js.map