import { GoogleGenAI, Type } from '@google/genai';
const SHOT_SPEC_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        composition: { type: Type.STRING, description: 'Framing and subject focus, e.g. medium shot, eye-level' },
        camera_motion: { type: Type.STRING, description: 'How the camera moves or static' },
        frame_rate: { type: Type.STRING, description: 'e.g. 24 fps' },
        resolution: { type: Type.STRING, description: 'e.g. 1920 x 1080' },
        lens: { type: Type.STRING, description: 'e.g. 50mm lens' },
        look: { type: Type.STRING, description: 'Optional film / color / texture notes' },
    },
    required: ['composition', 'camera_motion', 'frame_rate', 'resolution', 'lens'],
};
const LIGHTING_SPEC_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        primary: { type: Type.STRING },
        secondary: { type: Type.STRING },
        accents: { type: Type.STRING },
    },
};
const TIMELINE_BEAT_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        time: { type: Type.STRING },
        action: { type: Type.STRING },
    },
    required: ['time', 'action'],
};
const TEXT_RULES_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        emoji_policy: { type: Type.STRING, description: 'Must always be "no emojis"' },
        logo_policy: { type: Type.STRING, description: 'Must always be "no logos"' },
        text_policy: { type: Type.STRING, description: 'Must always be "no on-screen text"' },
        contrast: { type: Type.STRING, description: 'Contrast guidance for readability and scene tone' },
    },
    required: ['emoji_policy', 'logo_policy', 'text_policy', 'contrast'],
};
const COLOR_PALETTE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        background: { type: Type.STRING },
        ink_primary: { type: Type.STRING },
        ink_secondary: { type: Type.STRING },
        splatter: { type: Type.STRING },
        text_primary: { type: Type.STRING },
    },
    required: ['background', 'ink_primary', 'ink_secondary', 'splatter', 'text_primary'],
};
const VISUAL_RULES_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        prohibited_elements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Always include bans such as logos/text overlays if relevant',
        },
        grain: { type: Type.STRING },
        sharpen: { type: Type.STRING },
    },
    required: ['prohibited_elements'],
};
const METADATA_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        series: { type: Type.STRING },
        task: { type: Type.STRING },
        scene_number: { type: Type.STRING },
        tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Scene tags for retrieval/filtering',
        },
    },
    required: ['tags'],
};
/** Structured spec (not a stringified blob) so Gemini returns consistent JSON and avoids output truncation. */
const VISUAL_PROMPT_SPEC_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        scene: { type: Type.STRING, description: 'What is on screen: subject, environment, action' },
        style: { type: Type.STRING, description: 'Overall visual style and mood, e.g. realistic, natural lighting' },
        shot: SHOT_SPEC_SCHEMA,
        lighting: LIGHTING_SPEC_SCHEMA,
        timeline: {
            type: Type.ARRAY,
            items: TIMELINE_BEAT_SCHEMA,
            description: 'Optional beat-by-beat actions with time ranges',
        },
        text_rules: TEXT_RULES_SCHEMA,
        color_palette: COLOR_PALETTE_SCHEMA,
        visual_rules: VISUAL_RULES_SCHEMA,
        metadata: METADATA_SCHEMA,
    },
    required: ['scene', 'style', 'shot', 'text_rules', 'color_palette', 'visual_rules', 'metadata'],
};
const VIDEO_ANALYSIS_INSTRUCTIONS = `You are a professional video director.
Analyze this video. We want to recreate this video shot-for-shot using AI generated stock footage (B-roll).

Break the video down into chronological visual scenes.

For each scene:
1. "originalText": Describe exactly what is happening in this segment of the video, or the narration being spoken.
2. "visualPrompt": Structured fields — scene (on-screen content), style (look/mood), shot (composition, camera motion, lens, resolution, frame rate), lighting/timeline when useful, plus:
   - text_rules with fixed policies: no emojis, no logos, no on-screen text
   - color_palette with background, ink_primary, ink_secondary, splatter, text_primary
   - visual_rules (include prohibited_elements)
   - metadata with tags

Return a JSON object with a "scenes" array.`;
const SINGLE_SCENE_INSTRUCTIONS = `You are a professional video editor.
Create a detailed visual specification for the provided single scene description or script segment.

Fill scene, style, and shot (composition, camera_motion, frame_rate, resolution, lens). Add lighting and timeline when they help describe motion or edits.
Always include text_rules with: no emojis, no logos, no on-screen text.
Always include color_palette with background, ink_primary, ink_secondary, splatter, text_primary.
Also include visual_rules and metadata.tags.
Return structured data matching the response schema.`;
const RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        scenes: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    originalText: { type: Type.STRING, description: 'The description of the event or the audio transcript for this scene.' },
                    visualPrompt: VISUAL_PROMPT_SPEC_SCHEMA,
                },
                required: ['originalText', 'visualPrompt'],
            },
        },
    },
    required: ['scenes'],
};
const REGENERATE_RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        visualPrompt: VISUAL_PROMPT_SPEC_SCHEMA,
    },
    required: ['visualPrompt'],
};
const GEMINI_GENERATION_CONFIG = {
    maxOutputTokens: 8192,
};
const DEFAULT_MODEL = 'gemini-2.5-flash-lite';
const DEFAULT_IMAGE_MODEL = 'imagen-4.0-generate-001';
const DEFAULT_VIDEO_MODEL = 'veo-3.1-fast-generate-preview';
const maskApiKey = (key) => {
    if (!key)
        return '***';
    if (key.length <= 8)
        return `${key.slice(0, 2)}***`;
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
};
const getVideoAnalyzerApiKeyConfig = () => {
    const analyzerSpecificKey = process.env.GEMINI_API_KEY_VIDEO_SCENE_ANALYZER?.trim();
    if (analyzerSpecificKey) {
        return { key: analyzerSpecificKey, keyName: 'GEMINI_API_KEY_VIDEO_SCENE_ANALYZER' };
    }
    const analyzerFallbackKey = process.env.ANALYZER_GEMINI_KEY?.trim();
    if (analyzerFallbackKey) {
        return { key: analyzerFallbackKey, keyName: 'ANALYZER_GEMINI_KEY' };
    }
    throw new Error('Missing Gemini API key for Video Scene Analyzer. Set GEMINI_API_KEY_VIDEO_SCENE_ANALYZER or ANALYZER_GEMINI_KEY in backend/.env');
};
const normalizeVisualPromptForClient = (raw) => {
    if (raw == null) {
        return '{}';
    }
    if (typeof raw === 'object') {
        return JSON.stringify(raw, null, 2);
    }
    if (typeof raw === 'string') {
        try {
            return JSON.stringify(JSON.parse(raw), null, 2);
        }
        catch {
            return raw;
        }
    }
    return String(raw);
};
const mapResponseToScenes = (json) => {
    return json.scenes.map((scene, index) => ({
        id: `scene-${Date.now()}-${index}`,
        originalText: scene.originalText,
        visualPrompt: normalizeVisualPromptForClient(scene.visualPrompt),
        status: 'pending',
    }));
};
const parseVisualPromptToText = (prompt, styleModifier) => {
    let mainDescription = '';
    const details = [];
    try {
        const jsonPrompt = JSON.parse(prompt);
        if (jsonPrompt.scene && jsonPrompt.scene !== 'SWAP_ME') {
            mainDescription = jsonPrompt.scene;
        }
        if (jsonPrompt.shot?.composition && jsonPrompt.shot.composition !== 'SWAP_ME') {
            details.push(`Shot: ${jsonPrompt.shot.composition}`);
        }
        if (jsonPrompt.shot?.camera_motion && jsonPrompt.shot.camera_motion !== 'SWAP_ME') {
            details.push(`Movement: ${jsonPrompt.shot.camera_motion}`);
        }
        if (jsonPrompt.lighting?.primary && jsonPrompt.lighting.primary !== 'SWAP_ME') {
            details.push(`Lighting: ${jsonPrompt.lighting.primary}`);
        }
        if (Array.isArray(jsonPrompt.timeline)) {
            const actions = jsonPrompt.timeline
                .filter((point) => point.action && point.action !== 'SWAP_ME')
                .map((point) => point.action)
                .join(', ');
            if (actions) {
                details.push(`Action: ${actions}`);
            }
        }
    }
    catch {
        if (prompt.trim().startsWith('{')) {
            const match = prompt.match(/"scene"\s*:\s*"([^"]+)"/);
            if (match?.[1] && match[1] !== 'SWAP_ME') {
                mainDescription = match[1];
            }
            else {
                mainDescription = prompt.replace(/[{}"]/g, '').substring(0, 400);
            }
        }
        else {
            mainDescription = prompt;
        }
    }
    if (!mainDescription) {
        mainDescription = 'Cinematic B-roll footage';
    }
    return `${mainDescription}. ${details.join('. ')} Style: ${styleModifier}`.replace(/\s+/g, ' ').trim();
};
export const videoSceneAnalyzerService = {
    async analyzeVideo(videoBase64, mimeType) {
        const { key, keyName } = getVideoAnalyzerApiKeyConfig();
        const client = new GoogleGenAI({ apiKey: key });
        console.log(`[VideoSceneAnalyzer] Processing video analyze | keyName=${keyName} | key=${maskApiKey(key)} | mimeType=${mimeType} | base64Length=${videoBase64.length}`);
        try {
            const response = await client.models.generateContent({
                model: DEFAULT_MODEL,
                contents: {
                    parts: [
                        {
                            inlineData: {
                                mimeType,
                                data: videoBase64,
                            },
                        },
                        {
                            text: VIDEO_ANALYSIS_INSTRUCTIONS,
                        },
                    ],
                },
                config: {
                    ...GEMINI_GENERATION_CONFIG,
                    responseMimeType: 'application/json',
                    responseSchema: RESPONSE_SCHEMA,
                },
            });
            const json = JSON.parse(response.text || '{"scenes": []}');
            const scenes = mapResponseToScenes(json);
            console.log(`[VideoSceneAnalyzer] Analyze video completed | scenes=${scenes.length}`);
            return scenes;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error(`[VideoSceneAnalyzer] Analyze video failed | keyName=${keyName} | error=${message}`);
            throw error;
        }
    },
    async regenerateVisualPrompt(segmentText) {
        const { key } = getVideoAnalyzerApiKeyConfig();
        const client = new GoogleGenAI({ apiKey: key });
        const response = await client.models.generateContent({
            model: DEFAULT_MODEL,
            contents: `${SINGLE_SCENE_INSTRUCTIONS}\n\nSegment: "${segmentText}"`,
            config: {
                ...GEMINI_GENERATION_CONFIG,
                responseMimeType: 'application/json',
                responseSchema: REGENERATE_RESPONSE_SCHEMA,
            },
        });
        const json = JSON.parse(response.text || '{}');
        return normalizeVisualPromptForClient(json.visualPrompt ?? response.text);
    },
    async generateImage(prompt, styleModifier, aspectRatio) {
        const fullPrompt = parseVisualPromptToText(prompt, styleModifier);
        const { key } = getVideoAnalyzerApiKeyConfig();
        const client = new GoogleGenAI({ apiKey: key });
        const response = await client.models.generateImages({
            model: DEFAULT_IMAGE_MODEL,
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                aspectRatio,
                outputMimeType: 'image/jpeg',
            },
        });
        const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
        if (!base64Image) {
            throw new Error('No image generated');
        }
        return `data:image/jpeg;base64,${base64Image}`;
    },
    async generateVideo(prompt, styleModifier, aspectRatio) {
        const { key } = getVideoAnalyzerApiKeyConfig();
        const client = new GoogleGenAI({ apiKey: key });
        const fullPrompt = parseVisualPromptToText(prompt, styleModifier);
        const veoAspectRatio = aspectRatio === '9:16' || aspectRatio === '3:4' || aspectRatio === '1:1' ? '9:16' : '16:9';
        let operation = await client.models.generateVideos({
            model: DEFAULT_VIDEO_MODEL,
            prompt: fullPrompt,
            config: {
                numberOfVideos: 1,
                resolution: '1080p',
                aspectRatio: veoAspectRatio,
            },
        });
        while (!operation.done) {
            await new Promise((resolve) => setTimeout(resolve, 10000));
            operation = await client.operations.getVideosOperation({ operation });
        }
        if (operation.error) {
            throw new Error(`Video generation failed: ${operation.error.message || JSON.stringify(operation.error)}`);
        }
        const responseData = operation.response || operation.result;
        const downloadLink = responseData?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error('No video generated. The content may have been filtered by safety guidelines.');
        }
        const videoResponse = await fetch(`${downloadLink}&key=${key}`);
        if (!videoResponse.ok) {
            throw new Error(`Failed to fetch generated video: ${videoResponse.status} ${videoResponse.statusText}`);
        }
        const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
        return `data:video/mp4;base64,${videoBuffer.toString('base64')}`;
    },
};
//# sourceMappingURL=videoSceneAnalyzer.service.js.map