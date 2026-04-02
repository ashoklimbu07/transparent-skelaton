export type ManualCharacter = {
  enabled: boolean;
  detail: string;
};

export type ScenePrompt = {
  sceneIndex: number;
  imagePrompt: string;
};

export type ManualStoryStyle = 'cinematic-35mm' | 'photorealistic' | 'photorealistic-minimal';
