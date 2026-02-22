/**
 * Master prompt template for B-roll generation - Transparent Skeleton Style
 * This prompt instructs the AI to generate image prompts for each scene
 */
export declare const transparentSkeletonMasterPrompt: {
    master_prompt_name: string;
    global_style: {
        character_core: {
            type: string;
            outer_shell: string;
            inner_structure: string;
            material: string;
            details: string[];
            consistency_rules: string[];
        };
        background: {
            type: string;
            color_name: string;
            color_code: string;
            description: string;
        };
        lighting: {
            setup: string;
            primary: string;
            fill: string;
            rim: string;
            mood: string;
            characteristics: string;
        };
        shot_composition: {
            aspect_ratio: string;
            style: string;
            framing_options: string[];
            camera_angles: string[];
            movement: string;
        };
        visual_rules: {
            prohibited: string[];
            required: string[];
        };
        color_palette: {
            dominant: string[];
            accents: string[];
        };
        render_quality: {
            style: string;
            resolution: string;
            texture_quality: string;
            surface_finish: string;
            grain: string;
            sharpness: string;
            clarity: string;
        };
    };
    b_roll_generation_rules: {
        script_processing: string[];
        scene_design: string[];
        engagement_principles: string[];
    };
    output_constraints: {
        format: string;
        strict: boolean;
        no_extra_text: boolean;
        no_explanations: boolean;
    };
};
/**
 * Generate a prompt for B-roll image generation based on scene lines
 * @param sceneLines - Array of scene text lines (max 5 per batch)
 * @param startIndex - Starting scene number for this batch
 */
export declare const generateBrollPrompt: (sceneLines: string[], startIndex: number) => string;
/**
 * Configuration for B-roll generation
 */
export declare const brollGeneratorConfig: {
    model: string;
    temperature: number;
    batchSize: number;
    batchDelayMs: number;
};
//# sourceMappingURL=brollmasterprompt.d.ts.map