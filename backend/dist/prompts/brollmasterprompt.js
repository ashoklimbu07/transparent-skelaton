/**
 * Master prompt template for B-roll generation - Transparent Skeleton Style
 * This prompt instructs the AI to generate image prompts for each scene
 */
export const transparentSkeletonMasterPrompt = `CINEMATIC SKELETON MASTER PROMPT SYSTEM (JSON OUTPUT VERSION)

STEP 1: Script Analysis (MANDATORY FIRST STEP)

When the user pastes a dialogue script, internally analyze:

Emotional tone

Core topic

Implied environment

Intensity level

Psychological mood

Narrative energy

This analysis must guide ALL visual decisions. Do NOT output this analysis.

STEP 2: Character Lock (ABSOLUTE – DO NOT MODIFY)

Every scene MUST include the permanently locked character:

Ultra realistic anatomical human skeleton

Transparent crystal-clear glossy glass outer body shell

Medically accurate rib cage, clavicle, spine, pelvis

Natural realistic hand bone structure

Half-closed relaxed eyelids

Subtle confident smirk expression

Unreal Engine 5 hyper realism

Ray traced lighting

8K ultra detail

Cinematic depth of field

Strict Rules:

Character proportions must remain identical in all scenes.

Skeleton facial bone structure must remain unchanged.

Do NOT turn it into horror, monster, or cartoon style.

Keep anatomy medically accurate.

Expression may slightly adapt to emotion but must ALWAYS feel calm and confident.

STEP 3: Environment Adaptation

Choose a smart, context-aware environment based on the script

Lighting must reflect emotional tone

Add cinematic atmosphere (fog, particles, reflections, volumetric light, etc.)

Maintain photorealism at all times

Background must feel like real-world cinematic B-roll

STEP 4: Scene Generation System (MANDATORY RULES)

Generate EXACTLY the scenes explicitly requested in USER INPUT (no extras)

NEVER ask follow-up questions

NEVER mention pagination or future scenes

Maintain perfect character consistency across ALL scenes

STEP 5: JSON OUTPUT FORMAT (MANDATORY)

For EACH scene, output ONE valid JSON object using EXACTLY this structure:

{
"scene": "Full cinematic description including the locked skeleton character (from Step 2) with consistent anatomy and expression, integrated naturally into the environment and action of the scene.",
"shot": {
"type": "Use varied cinematic shot types (e.g., close-up, medium shot, wide shot, over-the-shoulder,top angle ,button angle,macro shot ,extreme close-up,extreme wide shot,etc.) depending on scene context",
"angle": "Use varied camera angles (e.g., eye level, low angle, high angle, tilt, etc.) based on emotional tone",
"framing": "Describe composition (e.g., centered, rule of thirds, off-center, foreground framing, etc.)"
},
"style": "photorealistic, ultra-detailed, cinematic, high-resolution, sharp focus, professional photography",
"lighting": {
"primary": "Describe realistic light sources בהתאם to environment",
"mood": "Match emotional tone of the scene"
},
"background": "Environment description designed as cinematic B-roll, realistic and context-aware",
"color_palette": "Scene-specific cinematic color grading matching mood and tone",
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

GLOBAL OUTPUT RULES

Output ONLY JSON objects (no explanations, no extra text)

Each scene = one JSON object
Output multiple JSON objects separated by exactly one blank line between objects.

Do NOT wrap in markdown

Do NOT add labels like "Scene 1"

Maintain strict consistency of the skeleton character across all scenes

Shot type, angle, and framing MUST vary intelligently per scene

Background MUST behave like cinematic B-roll and match narrative context

Style, quality, aspect_ratio, and strict_prohibitions MUST remain EXACTLY the same across all scenes`;
/**
 * Generate a prompt for B-roll image generation based on scene lines
 * @param sceneLines - Array of scene text lines (batch of scenes)
 * @param startIndex - Starting scene number for this batch
 */
export const generateBrollPrompt = (sceneLines, startIndex) => {
    return `${transparentSkeletonMasterPrompt}

USER INPUT DIALOGUE SCRIPT (FOR ANALYSIS):
${sceneLines.map((line, idx) => `Scene ${startIndex + idx + 1}: ${line}`).join('\n')}

Based on the script provided above, please proceed with STEP 1 (Script Analysis) and then generate scene prompts ONLY for the scenes listed in USER INPUT. Do not generate prompts for any other scenes.`;
};
/**
 * Configuration for B-roll generation
 */
export const brollGeneratorConfig = {
    model: 'gemini-2.5-flash',
    temperature: 0.3,
    batchSize: 5,
    batchDelayMs: 1000, // 1 second between batches
};
//# sourceMappingURL=brollmasterprompt.js.map