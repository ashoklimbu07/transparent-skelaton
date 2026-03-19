import { splitTopLevelJsonObjects } from './splitTopLevelJsonObjects.js';
import { normalizePromptBlocks } from './normalizePromptBlocks.js';
/**
 * Clean AI output to final format: "Scene N: Title" then prompt only. No markdown, no Negative Prompt or Suggested Settings.
 * Drops any leading content (e.g. script analysis) before the first scene.
 */
export function cleanBrollOutput(raw) {
    let text = raw
        .replace(/\r\n/g, '\n')
        .replace(/\*\*/g, '')
        .trim();
    // Remove markdown code fences if the model ever wraps the JSON.
    text = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
    // Try the new format first: pure JSON objects.
    const jsonObjects = splitTopLevelJsonObjects(text);
    if (jsonObjects.length > 0) {
        return normalizePromptBlocks(jsonObjects.join('\n\n'));
    }
    // Fallback: legacy "Scene N:" text format.
    const firstScene = text.match(/\bScene \d+:/i);
    if (firstScene && firstScene.index != null && firstScene.index > 0) {
        text = text.slice(firstScene.index).trim();
    }
    // Strip any trailing interactive questions like
    // "Do you want the next 4 scene prompts?"
    text = text
        .split('\n')
        .filter((line) => !/do you want the next/i.test(line) && !/next 4 scene prompts/i.test(line))
        .join('\n')
        .trim();
    const hasOldFormat = text.includes('Main Image Prompt:') ||
        text.includes('Negative Prompt:') ||
        text.includes('Suggested Settings:');
    if (!hasOldFormat) {
        // Normalize spacing so there is exactly one blank line between each scene block
        const simpleBlocks = text
            .split(/(?=Scene \d+:)/i)
            .map((b) => b.trim())
            .filter(Boolean);
        if (simpleBlocks.length > 0) {
            return normalizePromptBlocks(simpleBlocks.join('\n\n'));
        }
        return normalizePromptBlocks(text);
    }
    const sceneBlocks = text.split(/(?=Scene \d+:)/i).filter((b) => b.trim());
    const out = [];
    for (const block of sceneBlocks) {
        const firstLine = block.split('\n')[0]?.trim() || '';
        const title = firstLine.replace(/\*\*/g, '').trim();
        if (!title || !/^Scene \d+:/i.test(title))
            continue;
        const mainIdx = block.indexOf('Main Image Prompt:');
        const negIdx = block.indexOf('Negative Prompt:');
        const setIdx = block.indexOf('Suggested Settings:');
        const endIdx = negIdx >= 0 ? negIdx : setIdx >= 0 ? setIdx : block.length;
        let prompt;
        if (mainIdx >= 0) {
            prompt = block
                .slice(mainIdx + 'Main Image Prompt:'.length, endIdx)
                .replace(/\*\*/g, '')
                .trim();
        }
        else {
            prompt = block
                .slice(firstLine.length, endIdx)
                .replace(/\*\*/g, '')
                .trim();
        }
        if (prompt)
            out.push(`${title}\n${prompt}`);
    }
    // Join cleaned scenes with a single blank line between each prompt
    const cleanedScenes = out.join('\n\n');
    const normalizedBlocks = cleanedScenes
        .split(/(?=Scene \d+:)/i)
        .map((b) => b.trim())
        .filter(Boolean);
    const joined = normalizedBlocks.length > 0 ? normalizedBlocks.join('\n\n') : cleanedScenes;
    return normalizePromptBlocks(joined);
}
//# sourceMappingURL=cleanBrollOutput.js.map