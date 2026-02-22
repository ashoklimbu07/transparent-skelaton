/**
 * Master prompt template for B-roll generation - Transparent Skeleton Style
 * This prompt instructs the AI to generate image prompts for each scene
 */

export const transparentSkeletonMasterPrompt = {
  "master_prompt_name": "Consistent Translucent Anatomical Skeleton – Plastic Human Model on Blue",
  "global_style": {
    "character_core": {
      "type": "human anatomical model",
      "outer_shell": "semi-transparent plastic-like human form",
      "inner_structure": "visible realistic human skeleton inside the translucent body",
      "material": "smooth translucent polymer, medical anatomy model style",
      "details": [
        "human-like expressive eyes with visible pupils and sclera",
        "realistic teeth embedded in skull",
        "subtle facial volume instead of exposed bone face",
        "clearly visible ribs, spine, clavicles, pelvis seen through translucent body",
        "hands and joints appear plastic-translucent with bones visible inside"
      ],
      "consistency_rules": [
        "identical skull shape and facial proportions across all generations",
        "identical eye size, placement, and realism (never hollow sockets)",
        "fixed translucency level allowing ribs and spine to be clearly visible",
        "plastic anatomy-model appearance, never chalky bone",
        "no clothing unless explicitly specified"
      ]
    },
    "background": {
      "type": "solid studio background",
      "color_name": "blue",
      "color_code": "#2F6BFF",
      "description": "A solid light blue background with no distractions"
    },
    "lighting": {
      "setup": "professional studio lighting",
      "primary": "Softbox lighting from front-left for even illumination",
      "fill": "Soft fill light from front-right to reduce harsh shadows",
      "rim": "Subtle rim light to enhance translucency and depth",
      "mood": "well-lit, friendly, medical studio aesthetic",
      "characteristics": "clean highlights on translucent surfaces, minimal shadows, emphasizes internal skeleton visibility"
    },
    "shot_composition": {
      "aspect_ratio": "9:16",
      "style": "photorealistic, cinematic",
      "framing_options": ["close-up", "medium shot", "extreme close-up", "wide shot"],
      "camera_angles": ["eye-level", "slightly below", "slightly above", "macro perspective"],
      "movement": "static shots with intentional framing"
    },
    "visual_rules": {
      "prohibited": [
        "3D cartoon dinos",
        "cartoon outlines",
        "logos or text overlays",
        "3D cartoon style",
        "flat 2D cartoon style",
        "chalky bone appearance",
        "hollow eye sockets without eyes",
        "inconsistent translucency"
      ],
      "required": [
        "photorealistic rendering",
        "visible internal skeleton through translucent body",
        "human-like eyes with pupils",
        "consistent character proportions",
        "medical anatomy model aesthetic"
      ]
    },
    "color_palette": {
      "dominant": ["light blue (#2F6BFF)", "translucent white/cream", "bone white"],
      "accents": ["soft highlights", "subtle shadows"]
    },
    "render_quality": {
      "style": "ultra-realistic 3D anatomical render",
      "resolution": "4K",
      "texture_quality": "high",
      "surface_finish": "smooth translucent plastic with subtle internal refraction",
      "grain": "minimal to none",
      "sharpness": "standard to high",
      "clarity": "clean, well-lit, professional studio quality"
    }
  },
  "b_roll_generation_rules": {
    "script_processing": [
      "analyze the script for key ideas and actions",
      "translate each idea into a visual scene using the translucent anatomical character",
      "preserve anatomical realism while maintaining expressive human-like behavior"
    ],
    "scene_design": [
      "camera angles should highlight translucency and internal bones",
      "avoid flat skeleton-only framing",
      "use close-ups to emphasize eyes, teeth, and plastic material",
      "incorporate appropriate lighting for each emotional moment"
    ],
    "engagement_principles": [
      "strong visual hook using uncanny human-anatomy realism",
      "clear subject focus in every shot",
      "smooth progression from neutral to expressive moments",
      "maintain cinematic quality throughout"
    ]
  },
  "output_constraints": {
    "format": "json",
    "strict": true,
    "no_extra_text": true,
    "no_explanations": true
  }
};

/**
 * Generate a prompt for B-roll image generation based on scene lines
 * @param sceneLines - Array of scene text lines (max 5 per batch)
 * @param startIndex - Starting scene number for this batch
 */
export const generateBrollPrompt = (sceneLines: string[], startIndex: number): string => {
  const masterPrompt = transparentSkeletonMasterPrompt;
  
  return `You are an AI image generation prompt creator specialized in creating cinematic B-roll prompts.

MASTER STYLE CONFIGURATION:
${JSON.stringify(masterPrompt, null, 2)}

TASK: Generate image generation prompts for each of the following ${sceneLines.length} scenes.

CRITICAL REQUIREMENTS:
1. Each scene MUST follow the master style configuration exactly
2. Maintain character consistency (transparent skeleton with plastic human form)
3. Always use blue background (#2F6BFF)
4. Focus on the visual action or emotion described in each scene
5. Include camera angles, lighting, and composition details
6. Make each prompt detailed and specific for image generation

INPUT SCENES:
${sceneLines.map((line, idx) => `Scene ${startIndex + idx + 1}: ${line}`).join('\n')}

OUTPUT FORMAT:
Return ONLY a valid JSON object with this exact structure:
{
  "scene_${startIndex + 1}": {
    "scene_id": ${startIndex + 1},
    "action": "what the character is doing or the activity taking place",
    "visual_description": "detailed description of what is seen in the frame",
    "shot": {
      "composition": "shot type (close-up, medium shot, wide shot, extreme close-up)",
      "angle": "camera angle (eye-level, slightly below, slightly above, macro perspective)"
    },
    "lighting": {
      "setup": "lighting configuration (softbox front-left, fill front-right, rim light)",
      "mood": "lighting mood and feel"
    },
    "camera_logic": "reasoning for camera choice and how it serves the story",
    "focus": "main focus or subject of the scene",
    "mood": "emotional tone or atmosphere",
    "background_color": "#2F6BFF",
    "style": "photorealistic, cinematic",
    "aspect_ratio": "9:16"
  },
  ...
}

IMPORTANT OUTPUT RULES:
- Output ONLY the JSON object, nothing else
- No markdown formatting, no code blocks, no backticks
- No explanations or commentary
- action: Brief description of the character's activity or what they are doing (2-5 words)
- visual_description: 3-5 sentences describing the complete visual scene with character details, pose, expressions, internal skeleton visibility
- shot.composition: Specific shot type from the master style options
- shot.angle: Camera angle that best captures the moment
- lighting.setup: Describe the lighting arrangement (softbox, fill, rim lights)
- lighting.mood: The emotional quality the lighting creates
- camera_logic: Why this camera setup serves the narrative moment
- focus: The main subject or emotional element being emphasized
- mood: 2-4 words describing the emotional atmosphere
- style: Always "photorealistic, cinematic"
- aspect_ratio: Always "9:16"
- background_color: Always "#2F6BFF"
- Maintain consistency with the master style and visual rules
- NEVER include: 3D cartoon style, logos, cartoon outlines, chalky bones, hollow eye sockets

Example scene format (do NOT copy this content, create unique prompts for the scenes):
{
  "scene_id": 1,
  "action": "resting hands hesitantly near edge",
  "visual_description": "A medium shot of the translucent plastic-like human anatomical model sitting on the edge of a bed, hands resting hesitantly near the edge. The smooth semi-transparent skin reveals the complete skeleton inside - ribs, spine, and finger bones clearly visible through the polymer body. Human-like eyes gaze downward with a thoughtful expression. The translucent material refracts the studio lighting, creating subtle highlights along the curved surfaces.",
  "shot": {
    "composition": "medium shot",
    "angle": "eye-level"
  },
  "lighting": {
    "setup": "Softbox lighting from front-left with soft fill from front-right and subtle rim light to enhance translucency",
    "mood": "well-lit, introspective, friendly"
  },
  "camera_logic": "Eye-level medium shot allows viewer to connect with the character's hesitant posture while showcasing the internal skeleton through the translucent body.",
  "focus": "subtle emotional distance expressed through hand positioning and downward gaze",
  "mood": "quiet, reflective, slightly distant",
  "background_color": "#2F6BFF",
  "style": "3D anatomical render, high resolution",
  "aspect_ratio": "9:16"
}

Now generate the prompts for the scenes above:`;
};

/**
 * Configuration for B-roll generation
 */
export const brollGeneratorConfig = {
  model: 'gemini-2.5-flash',
  temperature: 0.2,
  batchSize: 5,
  batchDelayMs: 3000, // 3 seconds between batches
};
