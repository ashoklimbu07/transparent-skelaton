const API_BASE_URL = 'http://localhost:3000/api';

export interface BrollGenerationResponse {
  success: boolean;
  style: string;
  promptsJson: string;  // JSON format (JSON objects separated by blank lines)
  promptsPlain: string;  // Human-readable plain text format
  totalScenes: number;
}

export const apiService = {
  formatScript: async (script: string): Promise<string> => {
    try {
      console.log('🚀 Frontend: Sending format request to backend...');
      
      const response = await fetch(`${API_BASE_URL}/format`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script }),
      });

      console.log('📡 Frontend: Received response, status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        const message = error.details
          ? `${error.error}: ${error.details}`
          : error.error || 'Failed to format script';
        console.error('❌ Frontend: Backend returned error:', message);
        throw new Error(message);
      }

      const data = await response.json();
      console.log('✅ Frontend: Successfully received formatted script');
      return data.formattedScript;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('❌ Frontend: Network error - Cannot reach backend at', API_BASE_URL);
        throw new Error('Cannot connect to backend. Is it running on http://localhost:3000?');
      }
      throw error;
    }
  },

  generateBroll: async (scenes: Record<string, string>, style: string): Promise<BrollGenerationResponse> => {
    try {
      console.log('🎬 Frontend: Sending B-roll generation request to backend...');
      console.log(`   Style: ${style}`);
      console.log(`   Scenes: ${Object.keys(scenes).length}`);
      
      const response = await fetch(`${API_BASE_URL}/broll/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenes, style }),
      });

      console.log('📡 Frontend: Received B-roll response, status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        const message = error.details
          ? `${error.error}: ${error.details}`
          : error.error || 'Failed to generate B-roll';
        console.error('❌ Frontend: Backend returned error:', message);
        throw new Error(message);
      }

      const data = await response.json();
      console.log('✅ Frontend: Successfully received B-roll prompts');
      console.log(`   Total prompts generated: ${data.totalScenes}`);
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('❌ Frontend: Network error - Cannot reach backend at', API_BASE_URL);
        throw new Error('Cannot connect to backend. Is it running on http://localhost:3000?');
      }
      throw error;
    }
  },
};
