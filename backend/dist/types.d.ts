export interface ContextCard {
    subject: string;
    timeline: string[];
    locations: Array<{
        place: string;
        era: string;
    }>;
    character_map: Record<string, string>;
    tone: string;
    story_arc: string;
    visual_style: string;
    key_symbols: string[];
}
export interface SceneChunk {
    id: number;
    original: string;
    subject: string;
    setting: string;
    emotion: string;
    context: string;
    broll_prompt: string;
    continuity_note: string;
}
export interface BrollScene {
    id: number;
    scene: string;
    shot: {
        type: string;
        angle: string;
        framing: string;
    };
    style: string;
    lighting: {
        primary: string;
        mood: string;
    };
    background: string;
    color_palette: string;
    quality: string;
    aspect_ratio: string;
    strict_prohibitions: string[];
}
/** Single-call output from master analyzer (context + all scene chunks). */
export interface MasterAnalyzerResult {
    context_card: ContextCard;
    chunks: SceneChunk[];
}
export interface PipelineResult {
    context_card: ContextCard;
    chunks: SceneChunk[];
    scenes: BrollScene[];
    total_api_calls: number;
    scene_count: number;
}
export interface ApiKeyEntry {
    id: number;
    key: string;
    hitsUsed: number;
    limit: number;
    busy: boolean;
}
//# sourceMappingURL=types.d.ts.map