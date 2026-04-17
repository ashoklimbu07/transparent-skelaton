const SCRIPT_ANALYSIS_INSTRUCTIONS = `You are a professional video editor and B-roll director.
Analyze the following video script, which may be up to 10 minutes long.

Your specific task is to provide a granular, line-by-line breakdown of visual scenes.

Guidelines:
1. STRICT LINE-BY-LINE ANALYSIS: Do not group large paragraphs. Create a new visual scene for almost every sentence or distinct clause to ensure there is enough B-roll for the entire duration.
2. For a 10-minute script, generate as many scenes as necessary to cover the audio continuously (this could be 50-100+ scenes).
3. For each scene, provide:
   - "originalText": The exact sentence or phrase from the script.
   - "visualPrompt": You MUST use the provided JSON template for the visual prompt. Fill in all "SWAP_ME" fields relevant to the scene. Return the result as a valid, minimized JSON string inside the field.`;

const VIDEO_ANALYSIS_INSTRUCTIONS = `You are a professional video director.
Analyze this video. We want to recreate this video shot-for-shot using AI generated stock footage (B-roll).

Break the video down into chronological visual scenes.

For each scene:
1. "originalText": Describe exactly what is happening in this segment of the video, or the narration being spoken.
2. "visualPrompt": Create a detailed instruction to generate a similar shot. You MUST use the provided JSON template. Fill in all "SWAP_ME" fields to match the visual style, lighting, and composition of the source video.

Return a JSON object with a "scenes" array.`;

const SINGLE_SCENE_INSTRUCTIONS = `You are a professional video editor.
Create a detailed visual prompt for the provided single scene description or script segment.

Task:
Fill in the provided JSON template to create a complete visual specification for this scene. Replace all "SWAP_ME" values with creative, high-quality direction suitable for an AI video/image generator.

Return ONLY the filled-out JSON string.`;

export const buildScriptAnalysisPrompt = (script: string, visualTemplateJson: string) =>
  `${SCRIPT_ANALYSIS_INSTRUCTIONS}

Template:
${visualTemplateJson}

Script:
${script}`;

export const buildVideoAnalysisPrompt = (visualTemplateJson: string) =>
  `${VIDEO_ANALYSIS_INSTRUCTIONS}

Template:
${visualTemplateJson}`;

export const buildSingleScenePrompt = (segmentText: string, visualTemplateJson: string) =>
  `${SINGLE_SCENE_INSTRUCTIONS}

Segment: "${segmentText}"

Template:
${visualTemplateJson}`;
