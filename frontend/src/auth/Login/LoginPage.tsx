import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-[#f0ede8] font-['DM_Sans'] flex items-center justify-center px-5 py-10">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap"
      />

      <section className="w-full max-w-md border border-[#222222] bg-[#111111] p-7 md:p-8">
        <Link to="/" className="inline-block font-['Bebas_Neue'] text-[30px] tracking-[2px] mb-6">
          Broll<span className="text-[#ff3c00]">AI</span>
        </Link>

        <p className="text-[11px] tracking-[3px] uppercase text-[#ff3c00]">Welcome Back</p>
        <h1 className="font-['Bebas_Neue'] text-[42px] leading-none tracking-[1px] mt-1 mb-6">Log In</h1>

        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <div>
            <label htmlFor="login-email" className="block text-sm text-[#aaaaaa] mb-1.5">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full h-11 bg-[#080808] border border-[#222222] px-3 text-sm outline-none focus:border-[#ff3c00]"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm text-[#aaaaaa] mb-1.5">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className="w-full h-11 bg-[#080808] border border-[#222222] px-3 text-sm outline-none focus:border-[#ff3c00]"
            />
          </div>

          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="inline-flex items-center gap-2 text-[#aaaaaa]">
              <input type="checkbox" className="h-4 w-4 accent-[#ff3c00]" />
              Remember me
            </label>
            <button type="button" className="text-[#ff3c00] hover:text-[#ff5a28] transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-[#ff3c00] hover:bg-[#ff5a28] text-white text-sm font-medium uppercase tracking-[.5px] transition-colors"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-sm text-[#888888]">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-[#ff3c00] hover:text-[#ff5a28] transition-colors">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
