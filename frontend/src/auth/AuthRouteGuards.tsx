import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { ReactNode } from 'react';

function FullPageLoader() {
  return (
    <main className="min-h-screen bg-[#080808] text-[#f0ede8] font-['DM_Sans'] flex items-center justify-center px-5 py-10">
      <p className="text-sm text-[#aaaaaa] tracking-[0.5px]">Checking session...</p>
    </main>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/workspace" replace />;
  }

  return <>{children}</>;
}
