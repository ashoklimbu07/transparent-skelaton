/**
 * Manual Story -> image prompt generator (text-only for now).
 *
 * Note: The "master prompt" is intentionally kept simple because you said you'll
 * refine it later. The goal right now is to complete the flow + data plumbing.
 */
export function getManualStorySystemPrompt() {
    return `You generate detailed, consistent image prompts for a transparent glass skeleton video.

Input includes up to 5 character identities (c1..c5) with user-provided detailed clothing/identity descriptors.
The user will write scenes that may reference characters as c1..c5.

Rules you MUST follow:
- Maintain character consistency across ALL scenes by using the exact user-provided detail for each referenced cX.
- If a scene mentions cX, include that character's full detail in the prompt (clothing + identity descriptors).
- Only generate prompts for the provided scenes, in the same order.
- Focus on cinematic image composition: subject action, setting, lighting, camera angle, and style.
- The output MUST be valid JSON only. No markdown, no backticks, no commentary.

Global visual style:
transparent crystal-clear glossy glass skeleton, medically accurate anatomy, subtle confident expressions,
Unreal Engine 5 hyper realism, ray traced lighting, 8K, cinematic depth of field.
`;
}
export function getManualStoryUserPrompt(args) {
    const characterLines = Object.entries(args.characters)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
    const scenesLines = args.scenes
        .map((s, idx) => `Scene ${idx + 1}: ${s}`)
        .join('\n');
    return `CHARACTERS (c1..c5):
${characterLines || '(none)'}

SCENES:
${scenesLines}

TASK:
Return exactly ${args.scenes.length} prompts.

OUTPUT JSON (ONLY):
{
  "promptsByScene": [
    { "sceneIndex": 1, "imagePrompt": "..." }
  ]
}

Each "imagePrompt" must be a single line string (no newline characters).`;
}
//# sourceMappingURL=manualStorymasterprompt.js.map