import { Navigate, Route, Routes } from 'react-router-dom';
import { GeneratePage } from './generate/GeneratePage';
import { LandingPage } from './landingpage/LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/generate" element={<GeneratePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
