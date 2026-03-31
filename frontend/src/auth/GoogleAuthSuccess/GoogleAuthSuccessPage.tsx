import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export function GoogleAuthSuccessPage() {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const finalizeGoogleAuth = async () => {
      try {
        await refreshSession();
        navigate('/generate', { replace: true });
      } catch {
        setError('Google login succeeded, but session sync failed. Please try logging in again.');
      }
    };

    void finalizeGoogleAuth();
  }, [refreshSession, navigate]);

  return (
    <main className="min-h-screen bg-[#080808] text-[#f0ede8] font-['DM_Sans'] flex items-center justify-center px-5 py-10">
      <section className="w-full max-w-md border border-[#222222] bg-[#111111] p-7 md:p-8">
        <h1 className="font-['Bebas_Neue'] text-[36px] tracking-[1px]">Finishing Google Sign-in...</h1>
        {error ? (
          <p className="mt-4 text-sm text-[#ff5a28]">
            {error}{' '}
            <Link to="/login" className="text-[#ff3c00] hover:text-[#ff5a28]">
              Back to login
            </Link>
          </p>
        ) : (
          <p className="mt-4 text-sm text-[#aaaaaa]">Please wait while we secure your session.</p>
        )}
      </section>
    </main>
  );
}
