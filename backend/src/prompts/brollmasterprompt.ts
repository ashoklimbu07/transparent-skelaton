/**
 * Master prompt template for B-roll generation - Transparent Skeleton Style
 * This prompt instructs the AI to generate image prompts for each scene
 */

export const transparentSkeletonMasterPrompt = `🎬 CINEMATIC SKELETON MASTER PROMPT SYSTEM
STEP 1: Script Analysis (MANDATORY FIRST STEP)

When the user pastes a dialogue script, carefully analyze:
- Emotional tone
- Core topic
- Implied environment
- Intensity level
- Psychological mood
- Narrative energy

This analysis must guide all visual decisions in later steps.

STEP 2: Character Lock (ABSOLUTE – DO NOT MODIFY)

Every scene must include the following permanently locked character:
- Ultra realistic anatomical human skeleton
- Transparent crystal-clear glossy glass outer body shell
- Medically accurate rib cage, clavicle, spine, pelvis
- Natural realistic hand bone structure
- Half-closed relaxed eyelids
- Subtle confident smirk expression
- Unreal Engine 5 hyper realism
- Ray traced lighting
- 8K ultra detail
- Cinematic depth of field

Strict Rules:
1. Character proportions must remain identical in all scenes.
2. Skeleton facial bone structure must remain unchanged.
3. Do NOT turn it into horror, monster, or cartoon style.
4. Keep anatomy medically accurate.
5. Expression may slightly adjust depending on emotional tone but must always remain calm and confident.

STEP 3: Environment Adaptation

Based on the script meaning:
- Choose a smart, context-aware background
- Adjust lighting according to emotional tone
- Add cinematic atmosphere (fog, particles, light rays, reflections, etc.)
- Maintain realism at all times
- Match intensity and psychological mood visually

STEP 4: Scene Generation System (MANDATORY RULES)

- Convert the entire script into at least 20–25 cinematic scenes.
- NEVER output all scenes at once.
- Generate ONLY 4 scene prompts per response.
- After generating 4 scenes, always ask:
"Do you want the next 4 scene prompts?"
- When the user replies YES, generate the next 4 scenes.
- Continue until all scenes are completed.
- Maintain perfect character consistency across every scene.

STEP 5: Required Output Format (FOR EACH SCENE)

For every scene, output ONLY two lines in this exact format. No labels, no markdown, no extra sections.

Format (use exactly this structure):

Scene N: [Title]
[Single paragraph: the full cinematic image prompt. Include environment, lighting, camera angle, mood, realism, and the locked skeleton character. No line breaks inside this paragraph.]

Rules:
- Do NOT use markdown bold (**). Use plain text only.
- Do NOT include "Main Image Prompt:", "Negative Prompt:", or "Suggested Settings:" or any technical settings (Resolution, CFG, Steps, Sampler). Output only the scene number, title, and the one prompt paragraph per scene.
- Put a blank line between each scene.
- Example:

Scene 1: The Hypothetical Gaze
An ultra realistic anatomical human skeleton, transparent crystal-clear glossy glass outer body shell, medically accurate rib cage, clavicle, spine, pelvis, natural realistic hand bone structure, half-closed relaxed eyelids, and a subtle confident smirk expression, stands in a minimalist, ethereal space. Soft, diffused ray traced light gently reflects off its glass body, creating subtle refractions. The background is a deep, contemplative indigo gradient, with faint, almost imperceptible shimmering particles in the air. The skeleton's head is slightly tilted, as if pondering a profound question. Shot with an Unreal Engine 5 hyper realism aesthetic, 8K ultra detail, and cinematic depth of field, focusing sharply on the skeleton.

Scene 2: Dawn Over Ancient Sands
An ultra realistic anatomical human skeleton, transparent crystal-clear glossy glass outer body shell...

Global Consistency Rule
- The skeleton design must never change.
- Facial bone structure must remain identical across scenes.
- Body proportions must remain constant.
- Visual realism must always feel cinematic, not stylized.
- Unreal Engine 5 hyper realism aesthetic must be preserved.`;

/**
 * Generate a prompt for B-roll image generation based on scene lines
 * @param sceneLines - Array of scene text lines (max 4 per batch)
 * @param startIndex - Starting scene number for this batch
 */
export const generateBrollPrompt = (sceneLines: string[], startIndex: number): string => {
  return `${transparentSkeletonMasterPrompt}

USER INPUT DIALOGUE SCRIPT (FOR ANALYSIS):
${sceneLines.map((line, idx) => `Scene ${startIndex + idx + 1}: ${line}`).join('\n')}

Based on the script provided above, please proceed with STEP 1 (Script Analysis) and then generate the requested scene prompts following the system rules. Ensure you generate ONLY 4 scene prompts in this response.`;
};

/**
 * Configuration for B-roll generation
 */
export const brollGeneratorConfig = {
  model: 'gemini-2.5-flash',
  temperature: 0.3,
  batchSize: 4,
  batchDelayMs: 1000, // 3 seconds between batches
};
