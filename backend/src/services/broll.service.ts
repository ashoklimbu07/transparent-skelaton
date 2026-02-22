import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateBrollPrompt, brollGeneratorConfig } from '../prompts/brollmasterprompt.js';

interface BrollScene {
  scene_id: number;
  action: string;
  visual_description: string;
  shot: {
    composition: string;
    angle: string;
  };
  lighting: {
    setup: string;
    mood: string;
  };
  camera_logic: string;
  focus: string;
  mood: string;
  background_color: string;
  style: string;
  aspect_ratio: string;
}

/**
 * Validate a B-roll scene has all required fields
 * @param scene - Scene object to validate
 * @param sceneKey - Scene key for error messages
 */
const validateBrollScene = (scene: any, sceneKey: string): scene is BrollScene => {
  const requiredFields = ['scene_id', 'action', 'visual_description', 'camera_logic', 'focus', 'mood', 'background_color', 'style', 'aspect_ratio'];
  
  for (const field of requiredFields) {
    if (!scene[field]) {
      console.warn(`⚠️  ${sceneKey} missing required field: ${field}`);
      return false;
    }
  }
  
  // Validate nested shot object
  if (!scene.shot || !scene.shot.composition || !scene.shot.angle) {
    console.warn(`⚠️  ${sceneKey} missing required shot fields (composition, angle)`);
    return false;
  }
  
  // Validate nested lighting object
  if (!scene.lighting || !scene.lighting.setup || !scene.lighting.mood) {
    console.warn(`⚠️  ${sceneKey} missing required lighting fields (setup, mood)`);
    return false;
  }
  
  // Validate scene_id is a number
  if (typeof scene.scene_id !== 'number') {
    console.warn(`⚠️  ${sceneKey} scene_id must be a number`);
    return false;
  }
  
  return true;
};

/**
 * Convert structured B-roll JSON to JSON text format (JSON objects separated by blank lines)
 * @param scenes - Object with scene_X keys and BrollScene values
 * @returns Plain text formatted string with JSON objects separated by line breaks
 */
const formatBrollToJsonText = (scenes: Record<string, BrollScene>): string => {
  const sceneKeys = Object.keys(scenes).sort((a, b) => {
    const numA = parseInt(a.replace('scene_', ''));
    const numB = parseInt(b.replace('scene_', ''));
    return numA - numB;
  });

  const validScenes: string[] = [];
  
  for (const key of sceneKeys) {
    const scene = scenes[key];
    if (!scene) continue;
    
    // Validate scene
    if (!validateBrollScene(scene, key)) {
      console.error(`❌ Skipping ${key} due to validation errors`);
      continue;
    }
    
    // Format as JSON object
    const sceneJson = JSON.stringify({
      scene_id: scene.scene_id,
      action: scene.action,
      visual_description: scene.visual_description,
      shot: {
        composition: scene.shot.composition,
        angle: scene.shot.angle
      },
      lighting: {
        setup: scene.lighting.setup,
        mood: scene.lighting.mood
      },
      camera_logic: scene.camera_logic,
      focus: scene.focus,
      mood: scene.mood,
      background_color: scene.background_color,
      style: scene.style,
      aspect_ratio: scene.aspect_ratio
    }, null, 2);
    
    validScenes.push(sceneJson);
  }
  
  return validScenes.join('\n\n');
};

/**
 * Convert structured B-roll JSON to human-readable plain text format
 * @param scenes - Object with scene_X keys and BrollScene values
 * @returns Human-readable plain text with blank lines between prompts
 */
const formatBrollToPlainText = (scenes: Record<string, BrollScene>): string => {
  const sceneKeys = Object.keys(scenes).sort((a, b) => {
    const numA = parseInt(a.replace('scene_', ''));
    const numB = parseInt(b.replace('scene_', ''));
    return numA - numB;
  });

  const validScenes: string[] = [];
  
  for (const key of sceneKeys) {
    const scene = scenes[key];
    if (!scene) continue;
    
    // Validate scene
    if (!validateBrollScene(scene, key)) {
      console.error(`❌ Skipping ${key} due to validation errors`);
      continue;
    }
    
    // Format as flowing paragraph
    const paragraph = `${scene.visual_description} This ${scene.shot.composition} is captured at ${scene.shot.angle}, with ${scene.lighting.setup.toLowerCase()}, creating a ${scene.lighting.mood} atmosphere. ${scene.camera_logic} The focus is on ${scene.focus.toLowerCase()}, conveying a ${scene.mood} mood. The scene is rendered in a ${scene.style} style against a ${scene.background_color} background in ${scene.aspect_ratio} aspect ratio.`;
    
    validScenes.push(paragraph);
  }
  
  return validScenes.join('\n\n');
};

/**
 * Process script scenes in batches to generate B-roll image prompts
 */
export const brollService = {
  /**
   * Generate B-roll prompts for all scenes in batches
   * @param scenes - Object with scene_1, scene_2, etc.
   * @returns Object with both JSON text and plain text formats
   */
  generateBrollPrompts: async (scenes: Record<string, string>): Promise<{ jsonText: string; plainText: string }> => {
    console.log('🎬 Starting B-roll generation...');
    console.log('🔍 Checking Gemini API Key for B-Roll:', process.env.GEMINI_API_KEY_BROLL ? 'Present ✅' : 'Missing ❌');
    
    if (!process.env.GEMINI_API_KEY_BROLL) {
      throw new Error('GEMINI_API_KEY_BROLL is not configured in .env file');
    }

    // Convert scenes object to array of [key, value] pairs and sort by scene number
    const sceneEntries = Object.entries(scenes)
      .filter(([_, value]) => value && value.trim())
      .sort(([a], [b]) => {
        const numA = parseInt(a.replace('scene_', ''));
        const numB = parseInt(b.replace('scene_', ''));
        return numA - numB;
      });

    const totalScenes = sceneEntries.length;
    console.log(`📊 Total scenes to process: ${totalScenes}`);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_BROLL);
    const model = genAI.getGenerativeModel({ 
      model: brollGeneratorConfig.model,
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 8192,
        temperature: brollGeneratorConfig.temperature,
      }
    });

    const allPrompts: Record<string, BrollScene> = {};
    const batchSize = brollGeneratorConfig.batchSize;
    const totalBatches = Math.ceil(totalScenes / batchSize);

    // Process in batches
    for (let i = 0; i < totalScenes; i += batchSize) {
      const batchNumber = Math.floor(i / batchSize) + 1;
      const batch = sceneEntries.slice(i, i + batchSize);
      const sceneTexts = batch.map(([_, value]) => value);
      const startIndex = i;

      console.log(`\n🔄 Processing batch ${batchNumber}/${totalBatches} (scenes ${startIndex + 1}-${startIndex + batch.length})...`);

      try {
        const prompt = generateBrollPrompt(sceneTexts, startIndex);
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log(`✅ Batch ${batchNumber} response received`);

        // Parse and validate JSON
        try {
          const parsed = JSON.parse(text);
          
          // Merge this batch's prompts into the complete result
          Object.assign(allPrompts, parsed);
          
          console.log(`✅ Batch ${batchNumber} completed: ${Object.keys(parsed).length} prompts generated`);
        } catch (parseError) {
          console.error(`❌ Batch ${batchNumber} returned invalid JSON:`, text.substring(0, 200));
          throw new Error(`Batch ${batchNumber} failed: Invalid JSON response`);
        }

        // Wait before next batch (except for the last batch)
        if (i + batchSize < totalScenes) {
          const delaySeconds = brollGeneratorConfig.batchDelayMs / 1000;
          console.log(`⏳ Waiting ${delaySeconds} seconds before next batch...`);
          await new Promise(resolve => setTimeout(resolve, brollGeneratorConfig.batchDelayMs));
        }
      } catch (error: any) {
        console.error(`❌ Error in batch ${batchNumber}:`, error.message);
        throw new Error(`Failed at batch ${batchNumber}/${totalBatches}: ${error.message}`);
      }
    }

    console.log(`\n🎉 B-roll generation complete! Generated ${Object.keys(allPrompts).length} prompts`);
    
    // Convert to both formats
    const jsonTextOutput = formatBrollToJsonText(allPrompts);
    const plainTextOutput = formatBrollToPlainText(allPrompts);
    
    return {
      jsonText: jsonTextOutput,
      plainText: plainTextOutput
    };
  },
};
