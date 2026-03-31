import { Navigate, Route, Routes } from 'react-router-dom';
import { GeneratePage } from './generate/GeneratePage';
import { LandingPage } from './landingpage/LandingPage';
import { AccountSettingsPage } from './account/Settings/SettingsPage';
import { ThemePage } from './account/Theme/ThemePage';
import { LoginPage } from './auth/Login/LoginPage';
import { SignupPage } from './auth/Signup/SignupPage';
import { GoogleAuthSuccessPage } from './auth/GoogleAuthSuccess/GoogleAuthSuccessPage';
import { ProtectedRoute, PublicOnlyRoute } from './auth/AuthRouteGuards';
import { HistoryPage } from './extra/History/HistoryPage';
import { MediaLibraryPage } from './extra/MediaLibrary/MediaLibraryPage';
import { PromptCleanerPage } from './tools/PromptCleaner/PromptCleanerPage';
import { ScriptWriterPage } from './tools/ScriptWriter/ScriptWriterPage';
import { VideoSceneAnalyzerPage } from './tools/VideoSceneAnalyzer/VideoSceneAnalyzerPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
      <Route path="/auth/google/success" element={<GoogleAuthSuccessPage />} />
      <Route path="/generate" element={<ProtectedRoute><GeneratePage /></ProtectedRoute>} />
      <Route path="/tools/generate" element={<ProtectedRoute><GeneratePage /></ProtectedRoute>} />
      <Route path="/tools/video-scene-analyzer" element={<ProtectedRoute><VideoSceneAnalyzerPage /></ProtectedRoute>} />
      <Route path="/tools/script-writer" element={<ProtectedRoute><ScriptWriterPage /></ProtectedRoute>} />
      <Route path="/tools/prompt-cleaner" element={<ProtectedRoute><PromptCleanerPage /></ProtectedRoute>} />
      <Route path="/extra/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
      <Route path="/extra/media-library" element={<ProtectedRoute><MediaLibraryPage /></ProtectedRoute>} />
      <Route path="/account/theme" element={<ProtectedRoute><ThemePage /></ProtectedRoute>} />
      <Route path="/account/settings" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
