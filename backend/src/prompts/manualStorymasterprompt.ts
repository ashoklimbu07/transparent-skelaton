// Manual Story -> image prompt generator (text-only for now).
export function getManualStorySystemPrompt(): string {
  return `You generate detailed, consistent image prompts for cinematic video scenes.

Input includes up to 5 character identities (c1..c5) with user-provided detailed clothing/identity descriptors.
The user will write scenes that may reference characters as c1..c5.
Input also includes a selected visual style.

Rules you MUST follow:
- Maintain character consistency across ALL scenes by using the exact user-provided detail for each referenced cX.
- If a scene mentions cX, include that character's full detail in the prompt (clothing + identity descriptors).
- Do not output placeholders like "c1", "c2", etc. Replace each cX reference with the exact matching character detail from input.
- Only generate prompts for the provided scenes, in the same order.
- Focus on visual composition: subject action, setting, lighting, camera angle, and selected style.
- The output MUST be valid JSON only. No markdown, no backticks, no commentary.
`;
}

export function getManualStoryUserPrompt(args: {
  characters: Record<string, string>;
  scenes: string[];
  style: 'cinematic-35mm' | 'photorealistic';
}): string {
  const styleGuide =
    args.style === 'photorealistic'
      ? 'Photorealistic style: high-detail realism, natural color response, lifelike textures, physically plausible lighting, depth-rich composition, and authentic camera behavior.'
      : 'Cinematic 35mm camera style: 35mm film look, cinematic framing, dramatic but natural lighting, realistic lens behavior, rich contrast, filmic color response.';

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

SELECTED_STYLE:
${args.style}

STYLE_GUIDE:
${styleGuide}

TASK:
For each user scene, create:
1) One primary image prompt for the exact scene moment.
2) One super-catchy b-roll concept derived from that same scene, designed to increase impact while staying context-consistent.

Return exactly ${args.scenes.length} scene items in the same order as input scenes.

OUTPUT JSON (ONLY):
{
  "scenes": [
    {
      "sceneIndex": 1,
      "sourceScene": "Exact text of Scene 1 , 2, 3, etc. from input",
      "style": "selected style value",
      "mainImagePrompt": "single-line prompt for the primary scene moment",
      "broll": {
        "concept": "short catchy b-roll idea from the scene text",
        "brollPrompt": "single-line, production-ready visual prompt",
        "cameraAngle": "specific shot angle (e.g., low-angle tracking close-up)",
        "backgroundMatch": "how background/environment matches source scene",
        "impactHook": "why this b-roll moment is attention-grabbing and scene-impactful"
      }
    }
  ]
}

Field requirements:
- "sourceScene" must copy the matching input scene text exactly.
- "mainImagePrompt" and "broll.brollPrompt" must each be a single line string (no newline characters).
- "cameraAngle" and "backgroundMatch" are mandatory and specific (no vague text).
- b-roll must preserve character identity and scene continuity from sourceScene (same place/time/mood unless source scene implies a transition).
- Replace c1..c5 tokens with full character descriptors from CHARACTERS in both main and b-roll prompts.
- Every scene item must apply SELECTED_STYLE and STYLE_GUIDE exactly.
- Output valid JSON only, no extra keys outside this schema.`;
}

