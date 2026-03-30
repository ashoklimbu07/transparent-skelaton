import { Navigate, Route, Routes } from 'react-router-dom';
import { GeneratePage } from './generate/GeneratePage';
import { LandingPage } from './landingpage/LandingPage';
import { AccountSettingsPage } from './account/Settings/SettingsPage';
import { ThemePage } from './account/Theme/ThemePage';
import { LoginPage } from './auth/Login/LoginPage';
import { SignupPage } from './auth/Signup/SignupPage';
import { HistoryPage } from './extra/History/HistoryPage';
import { MediaLibraryPage } from './extra/MediaLibrary/MediaLibraryPage';
import { PromptCleanerPage } from './tools/PromptCleaner/PromptCleanerPage';
import { ScriptWriterPage } from './tools/ScriptWriter/ScriptWriterPage';
import { VideoSceneAnalyzerPage } from './tools/VideoSceneAnalyzer/VideoSceneAnalyzerPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/generate" element={<GeneratePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/tools/generate" element={<GeneratePage />} />
      <Route path="/tools/video-scene-analyzer" element={<VideoSceneAnalyzerPage />} />
      <Route path="/tools/script-writer" element={<ScriptWriterPage />} />
      <Route path="/tools/prompt-cleaner" element={<PromptCleanerPage />} />
      <Route path="/extra/history" element={<HistoryPage />} />
      <Route path="/extra/media-library" element={<MediaLibraryPage />} />
      <Route path="/account/theme" element={<ThemePage />} />
      <Route path="/account/settings" element={<AccountSettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
