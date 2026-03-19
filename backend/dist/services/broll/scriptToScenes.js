/**
 * Split a raw script into scene-like chunks (deterministic, no AI formatting step).
 */
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
            const chunkSize = Math.max(1, Math.ceil(words.length / minScenes));
            const chunks = [];
            for (let i = 0; i < words.length; i += chunkSize) {
                chunks.push(words.slice(i, i + chunkSize).join(' ').trim());
            }
            trimmed = chunks;
        }
    }
    trimmed = trimmed.slice(0, maxScenes);
    const scenes = {};
    trimmed.forEach((text, idx) => {
        scenes[`scene_${idx + 1}`] = text;
    });
    return scenes;
}
//# sourceMappingURL=scriptToScenes.js.map