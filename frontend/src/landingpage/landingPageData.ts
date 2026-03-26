export const tickerItems = [
  'Trending B-Roll',
  'AI Generated',
  'YouTube Shorts',
  'TikTok Ready',
  '9:16 Format',
  'Viral Content',
  'Auto Captions',
  'One Click Export',
];

export const stats = [
  { value: '2M+', label: 'B-Roll Clips in Library' },
  { value: '98%', label: 'Trend Match Accuracy' },
  { value: '8s', label: 'Avg Generation Time' },
  { value: '4K', label: 'Max Export Quality' },
];

export const steps = [
  {
    number: '01',
    icon: '✍️',
    title: 'Describe Your Content',
    description:
      'Type a topic, paste your script, or drop your voiceover. BrollAI reads your intent and detects what kind of visuals will hit hardest.',
  },
  {
    number: '02',
    icon: '🔥',
    title: 'AI Finds Trending B-Roll',
    description:
      'Our model scans trending content across TikTok & Shorts daily, matching visuals to your topic using semantic search + viral score weighting.',
  },
  {
    number: '03',
    icon: '✂️',
    title: 'Auto-Edits & Syncs',
    description:
      'Clips are trimmed, sequenced, and synced to your audio or captions automatically. Transitions, pacing, and cuts - all handled.',
  },
  {
    number: '04',
    icon: '🚀',
    title: 'Export & Post',
    description:
      'Download 9:16 ready clips at up to 4K. Optimized for TikTok, YouTube Shorts, and Instagram Reels - with captions baked in.',
  },
];

export const features = [
  {
    tag: 'Core',
    title: 'Trend-Aware B-Roll Matching',
    description:
      'Our AI monitors trending hashtags, audio, and visual styles across platforms daily. Every clip we suggest is relevant right now - not last month.',
    icon: '📡',
    wide: false,
  },
  {
    tag: 'Editing',
    title: 'Script-to-Video Sync',
    description:
      'Paste your script and we auto-match B-roll segments to each talking point. Timestamps, cuts, and scene switches are handled intelligently.',
    icon: '🎬',
    wide: false,
  },
  {
    tag: 'Export',
    title: 'Platform-Optimized Output',
    description:
      'Export exactly to spec for each platform - 9:16 for Shorts/TikTok/Reels, with correct frame rates, bitrates, and safe zones already applied.',
    icon: '📱',
    wide: false,
  },
  {
    tag: 'Text',
    title: 'Auto Captions & Hooks',
    description:
      'AI-generated captions with viral hook styles - bold, animated, word-by-word. Choose from 12 caption styles proven to boost watch time and retention.',
    icon: '💬',
    wide: false,
  },
  {
    tag: 'Workflow',
    title: 'Batch Generate. Post at Scale.',
    description:
      'Create 10, 20, or 50 variations of your B-roll video at once. Test different hooks, different visuals, different pacing. Find what performs - without the manual editing grind.',
    icon: '⚡',
    wide: true,
  },
];

export const platforms = [
  {
    name: 'TikTok',
    icon: '🎵',
    platform: 'tiktok',
    specs: ['9:16 vertical - Up to 4K', 'Trend audio sync', 'Duet-ready format', 'Max 3-min clips'],
  },
  {
    name: 'YouTube Shorts',
    icon: '▶️',
    platform: 'yt',
    specs: ['9:16 vertical - 60s max', 'Thumbnail auto-gen', 'Chapter markers', 'SEO title suggestions'],
  },
  {
    name: 'Instagram Reels',
    icon: '📸',
    platform: 'reels',
    specs: [
      '9:16 vertical - 90s max',
      'Story crosspost ready',
      'Branded watermark removal',
      'Cover frame selector',
    ],
  },
];

export const pricing = [
  {
    plan: 'Starter',
    amount: '0',
    period: 'forever free',
    popular: false,
    buttonLabel: 'Get Started Free',
    buttonVariant: 'outline' as const,
    features: [
      { label: '10 exports / month', muted: false },
      { label: '1080p max quality', muted: false },
      { label: 'Standard B-roll library', muted: false },
      { label: 'Auto captions', muted: false },
      { label: 'Trend matching', muted: true },
      { label: 'Batch generation', muted: true },
    ],
  },
  {
    plan: 'Creator',
    amount: '19',
    period: 'per month',
    popular: true,
    buttonLabel: 'Start 7-Day Free Trial',
    buttonVariant: 'solid' as const,
    features: [
      { label: '100 exports / month', muted: false },
      { label: '4K quality', muted: false },
      { label: 'Trend-matched B-roll', muted: false },
      { label: 'All caption styles', muted: false },
      { label: 'Batch generate (up to 10)', muted: false },
      { label: 'Priority rendering', muted: false },
    ],
  },
  {
    plan: 'Studio',
    amount: '59',
    period: 'per month',
    popular: false,
    buttonLabel: 'Contact Sales',
    buttonVariant: 'outline' as const,
    features: [
      { label: 'Unlimited exports', muted: false },
      { label: '4K + custom branding', muted: false },
      { label: 'All platform formats', muted: false },
      { label: 'Batch generate (up to 50)', muted: false },
      { label: 'API access', muted: false },
      { label: 'White-label output', muted: false },
    ],
  },
];
