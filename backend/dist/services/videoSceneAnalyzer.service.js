import { GoogleGenAI, Type } from '@google/genai';
const VISUAL_TEMPLATE = {
    scene: 'SWAP_ME',
    style: 'SWAP_ME',
    shot: {
        composition: 'SWAP_ME',
        camera_motion: 'SWAP_ME',
        frame_rate: '24 fps',
        resolution: '1920 × 1080',
        lens: 'SWAP_ME',
        look: 'SWAP_ME',
    },
    voice_over: {
        language: 'English',
        tone: 'SWAP_ME',
        mode: 'Narrative, explanatory',
        emotion: 'SWAP_ME',
        narration_text: 'SWAP_ME',
        duration_sec: 'SWAP_ME',
    },
    house_settings: {
        typeface: {
            hook: 'SWAP_ME',
            subtext: 'SWAP_ME',
        },
        overlay_style: 'SWAP_ME',
        animation: {
            enter: 'SWAP_ME',
            enter_duration_ms: 600,
            exit: 'SWAP_ME',
            exit_duration_ms: 500,
        },
        callouts: { stroke_px: 0, corner_radius_px: 0 },
        sizes: {
            hook_font_height_pct: 'SWAP_ME',
            sublabel_font_height_pct: 'SWAP_ME',
            safe_margins_pct: 7,
        },
    },
    timeline: [
        { time: '0.0–1.5 s', action: 'SWAP_ME' },
        { time: '1.5–3.0 s', action: 'SWAP_ME' },
        { time: '3.0–4.0 s', action: 'SWAP_ME' },
        { time: '4.0–5.5 s', action: 'SWAP_ME' },
        { time: '5.5–6.5 s', action: 'SWAP_ME' },
        { time: '6.5–7.5 s', action: 'SWAP_ME' },
        { time: '7.5–END', action: 'SWAP_ME' },
    ],
    lighting: {
        primary: 'SWAP_ME',
        secondary: 'SWAP_ME',
        accents: 'SWAP_ME',
    },
    audio: {
        ambient: 'SWAP_ME',
        sfx: ['SWAP_ME', 'SWAP_ME', 'SWAP_ME'],
        music: {
            track: 'SWAP_ME',
            description: 'SWAP_ME',
            tempo: 'SWAP_ME',
            key: 'SWAP_ME',
            dynamic_curve: 'SWAP_ME',
        },
        mix: {
            integrated_loudness: '-14 LUFS',
            sidechain_music_db_on_impacts: -3,
            natural_reverb: true,
        },
    },
    text_rules: {
        emoji_policy: 'no emojis',
        contrast: 'SWAP_ME',
    },
    color_palette: {
        background: 'SWAP_ME',
        ink_primary: '#111111',
        ink_secondary: '#444444',
        splatter: '#222222',
        text_primary: '#111111',
    },
    transitions: {
        between_scenes: 'SWAP_ME',
        impact_frame_usage: 'SWAP_ME',
        forbidden: ['glitch', 'marker squeaks', 'cartoon pops'],
    },
    vfx_rules: {
        grain: 'SWAP_ME',
        particles: 'SWAP_ME',
        camera_shake: 'SWAP_ME',
    },
    visual_rules: {
        prohibited_elements: ['3D dinos', 'cartoon outlines', 'logos'],
        grain: 'SWAP_ME',
        sharpen: 'SWAP_ME',
    },
    export: {
        preset: '1920x1080_h264_high',
        target_duration_sec: 'SWAP_ME',
    },
    metadata: {
        series: 'SWAP_ME',
        task: 'SWAP_ME',
        scene_number: 'SWAP_ME',
        tags: ['SWAP_ME', 'SWAP_ME', 'SWAP_ME'],
    },
};
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
const RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        scenes: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    originalText: { type: Type.STRING, description: 'The description of the event or the audio transcript for this scene.' },
                    visualPrompt: { type: Type.STRING, description: 'The filled-out JSON template string' },
                },
                required: ['originalText', 'visualPrompt'],
            },
        },
    },
    required: ['scenes'],
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
const mapResponseToScenes = (json) => {
    return json.scenes.map((scene, index) => ({
        id: `scene-${Date.now()}-${index}`,
        originalText: scene.originalText,
        visualPrompt: (() => {
            try {
                return JSON.stringify(JSON.parse(scene.visualPrompt), null, 2);
            }
            catch {
                return scene.visualPrompt;
            }
        })(),
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
    async analyzeScript(script) {
        const { key } = getVideoAnalyzerApiKeyConfig();
        const client = new GoogleGenAI({ apiKey: key });
        const response = await client.models.generateContent({
            model: DEFAULT_MODEL,
            contents: `${SCRIPT_ANALYSIS_INSTRUCTIONS}\n\nTemplate:\n${JSON.stringify(VISUAL_TEMPLATE)}\n\nScript:\n${script}`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: RESPONSE_SCHEMA,
            },
        });
        const json = JSON.parse(response.text || '{"scenes": []}');
        return mapResponseToScenes(json);
    },
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
                            text: `${VIDEO_ANALYSIS_INSTRUCTIONS}\n\nTemplate:\n${JSON.stringify(VISUAL_TEMPLATE)}`,
                        },
                    ],
                },
                config: {
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
            contents: `${SINGLE_SCENE_INSTRUCTIONS}\n\nSegment: "${segmentText}"\n\nTemplate:\n${JSON.stringify(VISUAL_TEMPLATE)}`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        visualPrompt: { type: Type.STRING, description: 'The filled-out JSON template string' },
                    },
                },
            },
        });
        const json = JSON.parse(response.text || '{}');
        const promptValue = json.visualPrompt || response.text || '{}';
        try {
            return JSON.stringify(JSON.parse(promptValue), null, 2);
        }
        catch {
            return promptValue;
        }
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