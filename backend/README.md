# Backend API - Transparent Skeleton B-Roll Generator

## Environment Setup

This backend uses **two separate Gemini API keys** for different operations:

### API Keys Configuration

1. **GEMINI_API_KEY_FORMAT** - Used for script formatting
   - Converts raw scripts into structured scene-by-scene format
   - Generates 25-30 scenes from the input script

2. **GEMINI_API_KEY_BROLL** - Used for B-roll generation
   - Creates detailed visual prompts for each scene
   - Generates cinematic descriptions with camera angles and mood

### Setup Instructions

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys:
   ```
   GEMINI_API_KEY_FORMAT=your_first_gemini_api_key
   GEMINI_API_KEY_BROLL=your_second_gemini_api_key
   ```

3. Get your API keys from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Why Separate Keys?

Using separate API keys allows you to:
- **Track usage separately** for formatting vs B-roll generation
- **Set different rate limits** for each operation
- **Use different billing accounts** if needed
- **Better monitor costs** for each service

### Running the Backend

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start the server
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### POST /api/format
Formats a raw script into structured scenes.

**Request:**
```json
{
  "script": "Your raw script text here..."
}
```

**Response:**
```json
{
  "success": true,
  "formattedScript": "{ \"scene_1\": \"...\", \"scene_2\": \"...\" }"
}
```

### POST /api/broll/generate
Generates B-roll prompts from formatted scenes.

**Request:**
```json
{
  "scenes": {
    "scene_1": "Scene description...",
    "scene_2": "Scene description..."
  },
  "style": "transparent_skeleton"
}
```

**Response:**
```json
{
  "success": true,
  "style": "transparent_skeleton",
  "prompts": "Plain text with JSON objects...",
  "totalScenes": 25
}
```

## Notes

- Both API keys must be valid Gemini API keys
- Make sure `.env` file is in the `backend` directory
- The `.env` file is git-ignored for security
