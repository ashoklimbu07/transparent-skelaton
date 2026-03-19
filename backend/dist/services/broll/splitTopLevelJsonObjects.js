/**
 * Extract top-level JSON objects from arbitrary model output.
 * We scan for balanced `{ ... }` blocks while respecting JSON strings so
 * braces inside strings don't break parsing.
 */
export function splitTopLevelJsonObjects(text) {
    const input = text.replace(/\r\n/g, '\n').trim();
    if (!input)
        return [];
    const objects = [];
    let i = 0;
    while (i < input.length) {
        // Skip until the next "{"
        while (i < input.length && input[i] !== '{')
            i++;
        if (i >= input.length)
            break;
        const start = i;
        let depth = 0;
        let inString = false;
        let escaped = false;
        while (i < input.length) {
            const ch = input[i];
            if (inString) {
                if (escaped) {
                    escaped = false;
                }
                else if (ch === '\\') {
                    escaped = true;
                }
                else if (ch === '"') {
                    inString = false;
                }
            }
            else {
                if (ch === '"') {
                    inString = true;
                }
                else if (ch === '{') {
                    depth++;
                }
                else if (ch === '}') {
                    depth--;
                    if (depth === 0) {
                        i++; // include closing brace
                        const obj = input.slice(start, i).trim();
                        if (obj)
                            objects.push(obj);
                        break;
                    }
                }
            }
            i++;
        }
        // If we couldn't find a balanced object, stop to avoid infinite loops.
        if (i <= start)
            break;
    }
    return objects;
}
//# sourceMappingURL=splitTopLevelJsonObjects.js.map