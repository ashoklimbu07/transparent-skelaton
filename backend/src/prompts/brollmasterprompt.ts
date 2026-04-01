/**
 * Final-stage B-roll JSON prompt: expands master-analyzer chunk seeds into full scene objects.
 * Input lines are broll_prompt strings from the master analyzer (already on-character and on-story).
 */

export const transparentSkeletonMasterPrompt = `CINEMATIC SKELETON FINAL B-ROLL (JSON OUTPUT)

You receive numbered scene lines from the MASTER ANALYZER. Each line is a seed broll_prompt: it already
targets the locked glass skeleton, resolved setting, and story beat. Your job is to expand each seed
into one full JSON scene object — preserve the narrative and visual intent; do not replace the character
with a human or change the core action.

STEP 1 — Use each seed as the spine of the "scene" field
Infer emotional tone, environment, and intensity from the seed text. Do not re-output a separate analysis.

STEP 2 — Character lock (ABSOLUTE)
Every scene MUST include the same locked character as in the seeds:
Ultra realistic anatomical human skeleton; transparent crystal-clear glossy glass outer shell;
medically accurate bones; subtle confident smirk; Unreal Engine 5 hyper realism, ray traced lighting,
8K detail, cinematic depth of field. No horror, monster, or cartoon. Anatomy stays accurate.

STEP 3 — Environment & B-roll
Match lighting and atmosphere to the seed. Background reads as cinematic B-roll (photoreal, context-aware).
Vary shot type, angle, and framing intelligently across scenes in this batch.

STEP 4 — JSON (MANDATORY)
Return ONE JSON array. Each element MUST include "id" matching the scene number from USER INPUT (1-based global order).
Exact shape per object:
{
  "id": <number>,
  "scene": "Full cinematic description including the locked skeleton, environment, and action.",
  "shot": {
    "type": "Varied cinematic shot (close-up, medium, wide, OTS, macro, etc.)",
    "angle": "eye level, low, high, tilt, etc.",
    "framing": "composition (rule of thirds, centered, foreground framing, etc.)"
  },
  "style": "photorealistic, ultra-detailed, cinematic, high-resolution, sharp focus, professional photography",
  "lighting": {
    "primary": "Realistic light sources appropriate to the environment",
    "mood": "Match emotional tone"
  },
  "background": "Cinematic B-roll environment, realistic and context-aware",
  "color_palette": "Scene-specific grading matching mood",
  "quality": "8k, ultra-realistic, razor-sharp details, intricate textures, cinematic depth of field, subtle bokeh, professional color grading",
  "aspect_ratio": "9:16",
  "strict_prohibitions": [
    "no text anywhere",
    "no cartoon style",
    "no animation",
    "no 3d render",
    "no low quality",
    "no logos or watermarks"
  ]
}

GLOBAL RULES
- Output ONLY valid JSON (no markdown, no prose outside the array).
- Generate EXACTLY the scenes listed in USER INPUT — no extras, no omissions.
- "id" must match the scene numbers provided.
- strict_prohibitions, style, aspect_ratio, and quality strings must stay consistent across scenes in this response.`;

/**
 * @param sceneLines — broll_prompt strings from master analyzer chunks (one batch)
 * @param startIndex — zero-based global index of first scene in this batch (used for labels only; ids are explicit in prompt)
 */
export const generateBrollPrompt = (sceneLines: string[], startIndex: number): string => {
  return `${transparentSkeletonMasterPrompt}

USER INPUT — expand each into one JSON object with matching id:
${sceneLines.map((line, idx) => `Scene id ${startIndex + idx + 1}: ${line}`).join('\n')}

Return a JSON array of exactly ${sceneLines.length} objects, ids ${startIndex + 1} through ${startIndex + sceneLines.length}.`;
};

export const brollGeneratorConfig = {
  model: 'gemini-2.5-flash',
  temperature: 0.3,
  batchSize: 5,
  batchDelayMs: 1000,
};
