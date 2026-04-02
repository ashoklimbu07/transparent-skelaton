export type ManualCharacter = {
  enabled: boolean;
  detail: string;
};

/** Parsed scene from textarea (user "Scene N:" labels or implicit 1..n). */
export type ManualStorySceneInput = {
  sceneIndex: number;
  text: string;
};

export type ScenePrompt = {
  sceneIndex: number;
  imagePrompt: string;
};

export type ManualStoryStyle = 'cinematic-35mm' | 'photorealistic';
