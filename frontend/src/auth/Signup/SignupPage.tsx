import { Link } from 'react-router-dom';
import { getGoogleStartUrl } from '../authApi';

export function SignupPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#181818_0%,_#080808_45%,_#050505_100%)] text-[#f0ede8] font-['DM_Sans'] flex items-center justify-center px-5 py-10">
      <style>{`
        @keyframes authFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes authGlow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .auth-float,
          .auth-glow {
            animation: none !important;
          }
        }
      `}</style>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap"
      />

      <div className="relative w-full max-w-md">
        <div className="auth-glow pointer-events-none absolute -inset-6 -z-10 rounded-[30px] bg-[radial-gradient(circle,_rgba(255,60,0,0.3)_0%,_rgba(255,60,0,0)_72%)] [animation:authGlow_5.5s_ease-in-out_infinite]" />
        <section className="auth-float relative w-full border border-[#2a2a2a] bg-[linear-gradient(180deg,_#121212_0%,_#0d0d0d_100%)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.55)] [animation:authFloat_6s_ease-in-out_infinite] sm:p-7 md:p-8">
        <Link to="/" className="inline-block font-['Bebas_Neue'] text-[30px] tracking-[2px] mb-6">
          Broll<span className="text-[#ff3c00]">AI</span>
        </Link>

        <div className="mb-1 flex items-start justify-between gap-3">
          <p className="text-[11px] tracking-[3px] uppercase text-[#ff3c00]">Create Account</p>
          <Link
            to="/login"
            className="text-[11px] uppercase tracking-[1.5px] text-[#8c8c8c] transition-colors hover:text-[#f0ede8]"
          >
            Have account?
          </Link>
        </div>
        <h1 className="font-['Bebas_Neue'] text-[42px] leading-none tracking-[1px] mt-1 mb-6">Sign Up</h1>

        <a
          href={getGoogleStartUrl()}
          className="mb-4 inline-flex h-12 w-full items-center justify-center gap-3 border border-[#d8d8d8] bg-white px-4 text-sm font-semibold uppercase tracking-[.6px] text-black transition-all hover:-translate-y-[1px] hover:bg-[#f2f2f2] hover:shadow-[0_8px_22px_rgba(255,255,255,0.18)]"
        >
          <svg aria-hidden="true" viewBox="0 0 18 18" className="h-[18px] w-[18px] shrink-0">
            <path
              fill="#EA4335"
              d="M17.64 9.2045c0-.6382-.0573-1.2518-.1636-1.8409H9v3.4818h4.8436c-.2086 1.125-.8427 2.0782-1.7968 2.7155v2.2582h2.9086c1.7018-1.5664 2.6846-3.875 2.6846-6.6146Z"
            />
            <path
              fill="#4285F4"
              d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9086-2.2582c-.8059.54-1.8368.8591-3.0477.8591-2.3441 0-4.3282-1.5832-5.0373-3.7105H.9573v2.3318A8.9999 8.9999 0 0 0 9 18Z"
            />
            <path
              fill="#FBBC05"
              d="M3.9627 10.7095A5.411 5.411 0 0 1 3.6818 9c0-.5932.1018-1.1682.2809-1.7095V4.9586H.9573A8.9998 8.9998 0 0 0 0 9c0 1.4523.3482 2.8277.9573 4.0414l3.0054-2.3319Z"
            />
            <path
              fill="#34A853"
              d="M9 3.5795c1.3214 0 2.5077.4541 3.4418 1.3459l2.5814-2.5814C13.4636.8918 11.43 0 9 0A8.9999 8.9999 0 0 0 .9573 4.9586l3.0054 2.3319C4.6718 5.1627 6.6559 3.5795 9 3.5795Z"
            />
          </svg>
          Sign up with Google
        </a>

        <p className="mb-6 text-sm leading-relaxed text-[#a4a4a4]">
          We now support Google-only signup. Continue with your Google account.
        </p>

        <p className="mt-6 border-t border-[#202020] pt-5 text-sm text-[#8f8f8f]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#ff3c00] hover:text-[#ff5a28] transition-colors">
            Log in
          </Link>
        </p>
        </section>
      </div>
    </main>
  );
}
