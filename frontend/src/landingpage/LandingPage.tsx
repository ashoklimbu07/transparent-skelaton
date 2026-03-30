import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './landingPage.css';
import { features, platforms, pricing, stats, steps, tickerItems } from './landingPageData';

const sectionPad = 'px-5 md:px-12';

export function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cursorExpanded, setCursorExpanded] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const revealRef = useRef<HTMLDivElement | null>(null);
  const tickerLoop = useMemo(() => [...tickerItems, ...tickerItems], []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    const onMouseMove = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!revealRef.current) {
      return;
    }

    const elements = revealRef.current.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('reveal-visible'), index * 60);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={revealRef}
      className="bg-[#080808] text-[#f0ede8] min-h-screen overflow-x-hidden font-['DM_Sans']"
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap"
      />

      <div
        className={`hidden md:block pointer-events-none fixed z-[9999] mix-blend-difference rounded-full transition-all duration-150 ${
          cursorExpanded ? 'w-10 h-10 bg-[#ffb800]' : 'w-3 h-3 bg-[#ff3c00]'
        }`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div
        className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.03] bg-cover"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-4 md:py-5 ${sectionPad} border-b transition-all duration-300 ${
          isScrolled ? 'border-[#222222] bg-[rgba(8,8,8,.92)] backdrop-blur-md' : 'border-transparent'
        }`}
      >
        <a href="#" className="font-['Bebas_Neue'] text-[28px] tracking-[2px]">
          Broll<span className="text-[#ff3c00]">AI</span>
        </a>
        <ul className="hidden md:flex gap-8 text-[13px] uppercase tracking-[.5px] text-[#666666]">
          <li>
            <a className="hover:text-[#f0ede8] transition-colors" href="#how">
              How It Works
            </a>
          </li>
          <li>
            <a className="hover:text-[#f0ede8] transition-colors" href="#features">
              Features
            </a>
          </li>
          <li>
            <a className="hover:text-[#f0ede8] transition-colors" href="#pricing">
              Pricing
            </a>
          </li>
        </ul>
        <button
          className="bg-[#ff3c00] hover:bg-[#ff5a28] text-white text-[13px] font-medium uppercase tracking-[.5px] px-4 md:px-[22px] py-2.5 transition-all duration-200 hover:-translate-y-[1px]"
          onMouseEnter={() => setCursorExpanded(true)}
          onMouseLeave={() => setCursorExpanded(false)}
          onClick={() => navigate('/signup')}
        >
          Get Early Access
        </button>
      </nav>

      <section className={`relative min-h-screen flex flex-col justify-end pb-12 md:pb-16 ${sectionPad}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_30%,rgba(255,60,0,.12)_0%,transparent_60%),radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(255,184,0,.06)_0%,transparent_50%)]" />
        <div className="absolute top-0 left-0 right-0 h-10 bg-[#ff3c00] overflow-hidden flex items-center">
          <div className="flex whitespace-nowrap animate-ticker">
            {tickerLoop.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="font-['Bebas_Neue'] text-base tracking-[3px] text-white px-6 after:content-['✦'] after:ml-3 after:text-white/50"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <p data-reveal className="reveal-item text-[11px] tracking-[4px] uppercase text-[#ff3c00] mb-5">
          AI-Powered Short-Form Video
        </p>
        <h1
          data-reveal
          className="reveal-item font-['Bebas_Neue'] leading-[0.92] tracking-[-1px] text-[clamp(72px,12vw,160px)]"
        >
          Generate
          <br />
          <em className="not-italic text-transparent [-webkit-text-stroke:1px_#f0ede8]">Trending</em>
          <br />
          B-Roll <span className="text-[#ff3c00]">Fast.</span>
        </h1>

        <div
          data-reveal
          className="reveal-item mt-8 md:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <p className="max-w-[400px] text-base leading-[1.7] text-[#aaaaaa]">
            Describe your topic. BrollAI finds trending visuals, syncs them to your script, and exports
            vertical-ready clips for TikTok, YouTube Shorts & Reels - in seconds.
          </p>
          <div className="flex flex-col md:items-end gap-3">
            <button
              className="relative overflow-hidden bg-[#ff3c00] hover:bg-[#ff5a28] text-white text-[15px] font-medium tracking-[.5px] py-4 px-10 transition-all duration-200 hover:-translate-y-0.5 btn-shine"
              onMouseEnter={() => setCursorExpanded(true)}
              onMouseLeave={() => setCursorExpanded(false)}
              onClick={() => navigate('/signup')}
            >
              Start for Free →
            </button>
            <span className="text-xs tracking-[.3px] text-[#666666]">No credit card - 10 free exports/month</span>
          </div>
        </div>

        <div className="hidden md:flex absolute bottom-16 right-12 flex-col items-center gap-2 [writing-mode:vertical-rl] text-[11px] uppercase tracking-[3px] text-[#666666] animate-fade-in-delayed">
          <span className="h-[60px] w-px bg-gradient-to-b from-[#ff3c00] to-transparent animate-scroll-line" />
          Scroll
        </div>
      </section>

      <section data-reveal className={`reveal-item bg-[#111111] border-y border-[#222222] ${sectionPad} py-7`}>
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x md:divide-[#222222] gap-5 md:gap-0">
          {stats.map((stat) => (
            <div key={stat.label} className="md:px-10">
              <div className="font-['Bebas_Neue'] text-[42px] leading-none tracking-[1px] text-[#ff3c00]">
                {stat.value}
              </div>
              <div className="mt-1 text-xs tracking-[1px] uppercase text-[#666666]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className={`${sectionPad} py-16 md:py-[100px]`}>
        <p data-reveal className="reveal-item text-[11px] tracking-[4px] uppercase text-[#ff3c00] mb-4">
          How It Works
        </p>
        <h2
          data-reveal
          className="reveal-item font-['Bebas_Neue'] leading-none tracking-[.5px] text-[clamp(40px,6vw,80px)]"
        >
          Three Steps.
          <br />
          Zero Guesswork.
        </h2>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px border border-[#222222] bg-[#222222]">
          {steps.map((step) => (
            <div
              key={step.number}
              data-reveal
              className="reveal-item group bg-[#080808] hover:bg-[#111111] p-8 md:p-10 relative overflow-hidden transition-colors duration-200"
              onMouseEnter={() => setCursorExpanded(true)}
              onMouseLeave={() => setCursorExpanded(false)}
            >
              <div className="font-['Bebas_Neue'] text-[80px] leading-none mb-6 text-[#222222] group-hover:text-[#ff3c00] transition-colors duration-200">
                {step.number}
              </div>
              <div className="text-[28px] mb-4">{step.icon}</div>
              <h3 className="text-lg font-medium mb-3">{step.title}</h3>
              <p className="text-sm leading-[1.7] text-[#888888]">{step.description}</p>
              <span className="absolute left-0 bottom-0 h-0.5 bg-[#ff3c00] w-0 group-hover:w-full transition-all duration-300" />
            </div>
          ))}
        </div>
      </section>

      <section id="features" className={`${sectionPad} py-16 md:py-[100px] bg-[#111111] border-t border-[#222222]`}>
        <p data-reveal className="reveal-item text-[11px] tracking-[4px] uppercase text-[#ff3c00] mb-4">
          Features
        </p>
        <h2
          data-reveal
          className="reveal-item font-['Bebas_Neue'] leading-none tracking-[.5px] text-[clamp(40px,6vw,80px)]"
        >
          Built for Creators
          <br />
          Who Move Fast.
        </h2>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-px border border-[#222222] bg-[#222222]">
          {features.map((feature) => (
            <div
              key={feature.title}
              data-reveal
              className={`reveal-item group relative overflow-hidden bg-[#111111] hover:bg-[#1e1e1e] transition-colors duration-200 p-10 md:p-12 ${
                feature.wide ? 'md:col-span-2' : ''
              }`}
              onMouseEnter={() => setCursorExpanded(true)}
              onMouseLeave={() => setCursorExpanded(false)}
            >
              <span className="inline-block text-[10px] tracking-[2px] uppercase text-[#ff3c00] border border-[#ff3c00] py-[3px] px-[10px] mb-5">
                {feature.tag}
              </span>
              <h3 className="text-[22px] font-medium mb-3">{feature.title}</h3>
              <p className="text-sm leading-[1.8] text-[#888888] max-w-[460px]">{feature.description}</p>
              <span className="absolute right-10 bottom-10 text-[64px] opacity-[.06] group-hover:opacity-[.12] group-hover:scale-110 group-hover:-rotate-[5deg] transition-all duration-300">
                {feature.icon}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={`${sectionPad} py-16 md:py-[100px]`}>
        <p className="text-[11px] tracking-[4px] uppercase text-[#ff3c00] mb-4">Platform Support</p>
        <h2 className="font-['Bebas_Neue'] leading-none tracking-[.5px] text-[clamp(40px,6vw,80px)]">
          Optimized for Every
          <br />
          Short-Form Platform.
        </h2>
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-px">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              data-reveal
              className={`reveal-item group relative overflow-hidden bg-[#111111] border border-[#222222] p-8 md:p-12 text-center transition-all duration-200 hover:-translate-y-1 ${
                platform.platform === 'tiktok'
                  ? 'hover:border-[#00f2ea]'
                  : platform.platform === 'yt'
                    ? 'hover:border-[#ff0000]'
                    : 'hover:border-[#ff3c00]'
              }`}
              onMouseEnter={() => setCursorExpanded(true)}
              onMouseLeave={() => setCursorExpanded(false)}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(255,60,0,.08)_0%,transparent_70%)]" />
              <div className="relative text-[48px] mb-4">{platform.icon}</div>
              <h3 className="relative font-['Bebas_Neue'] text-[32px] tracking-[2px] mb-2">{platform.name}</h3>
              <p className="relative text-[13px] leading-[1.8] text-[#666666]">
                {platform.specs.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className={`${sectionPad} py-16 md:py-[100px] bg-[#111111] border-t border-[#222222]`}>
        <p data-reveal className="reveal-item text-[11px] tracking-[4px] uppercase text-[#ff3c00] mb-4">
          Pricing
        </p>
        <h2
          data-reveal
          className="reveal-item font-['Bebas_Neue'] leading-none tracking-[.5px] text-[clamp(40px,6vw,80px)]"
        >
          Simple Pricing.
          <br />
          No Surprises.
        </h2>
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#222222] border border-[#222222]">
          {pricing.map((plan) => (
            <article
              key={plan.plan}
              data-reveal
              className={`reveal-item relative bg-[#111111] hover:bg-[#161616] transition-colors duration-200 p-9 md:p-12 ${
                plan.popular ? 'border-t-2 border-[#ff3c00]' : ''
              }`}
              onMouseEnter={() => setCursorExpanded(true)}
              onMouseLeave={() => setCursorExpanded(false)}
            >
              {plan.popular ? (
                <span className="absolute -top-px left-9 bg-[#ff3c00] text-white text-[10px] tracking-[2px] uppercase py-1 px-3">
                  Most Popular
                </span>
              ) : null}

              <p className="text-[11px] tracking-[3px] uppercase text-[#666666] mb-5">{plan.plan}</p>
              <p className="font-['Bebas_Neue'] text-[64px] leading-none tracking-[-1px] mb-1">
                <span className="text-2xl align-super">$</span>
                {plan.amount}
              </p>
              <p className="text-[13px] text-[#666666] mb-8">{plan.period}</p>
              <ul className="flex flex-col gap-3 mb-9">
                {plan.features.map((feature) => (
                  <li
                    key={feature.label}
                    className={`text-sm flex gap-2.5 items-start ${
                      feature.muted ? 'text-[#666666] line-through' : 'text-[#aaaaaa]'
                    }`}
                  >
                    <span className={feature.muted ? 'text-[#666666]' : 'text-[#ff3c00]'}>→</span>
                    {feature.label}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3.5 text-sm font-medium uppercase tracking-[.5px] transition-colors duration-200 ${
                  plan.buttonVariant === 'solid'
                    ? 'bg-[#ff3c00] border border-[#ff3c00] text-white hover:bg-[#ff5a28]'
                    : 'bg-transparent border border-[#222222] text-[#f0ede8] hover:border-[#f0ede8]'
                }`}
                onClick={() => navigate('/signup')}
              >
                {plan.buttonLabel}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className={`relative overflow-hidden text-center ${sectionPad} py-20 md:py-[120px]`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(255,60,0,.1)_0%,transparent_70%)]" />
        <p data-reveal className="reveal-item text-[11px] tracking-[4px] uppercase text-[#ff3c00] mb-4 relative">
          Get Started Today
        </p>
        <h2
          data-reveal
          className="reveal-item relative font-['Bebas_Neue'] leading-none text-[clamp(48px,8vw,100px)]"
        >
          Stop Wasting Time
          <br />
          <em className="not-italic text-transparent [-webkit-text-stroke:1px_#f0ede8]">Hunting Clips.</em>
        </h2>
        <p data-reveal className="reveal-item relative text-lg leading-[1.7] text-[#888888] max-w-[480px] mx-auto mt-6 mb-12">
          Let AI handle the B-roll while you focus on ideas. 10 free exports a month, no credit card needed.
        </p>
        <div data-reveal className="reveal-item relative flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="relative overflow-hidden bg-[#ff3c00] hover:bg-[#ff5a28] text-white text-[15px] font-medium tracking-[.5px] py-4 px-10 transition-all duration-200 hover:-translate-y-0.5 btn-shine"
            onMouseEnter={() => setCursorExpanded(true)}
            onMouseLeave={() => setCursorExpanded(false)}
            onClick={() => navigate('/signup')}
          >
            Generate Your First Clip →
          </button>
          <button
            className="bg-transparent border border-[#222222] hover:border-[#f0ede8] text-[#f0ede8] text-sm font-medium tracking-[.5px] py-3.5 px-8 transition-colors duration-200"
            onMouseEnter={() => setCursorExpanded(true)}
            onMouseLeave={() => setCursorExpanded(false)}
            onClick={() => navigate('/login')}
          >
            Watch Demo
          </button>
        </div>
      </section>

      <footer className={`${sectionPad} py-8 md:py-10 border-t border-[#222222] flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left`}>
        <div className="font-['Bebas_Neue'] text-[22px] tracking-[2px]">
          Broll<span className="text-[#ff3c00]">AI</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-xs tracking-[.5px] uppercase text-[#666666]">
          {['Privacy', 'Terms', 'Blog', 'Twitter', 'Discord'].map((item) => (
            <a key={item} href="#" className="hover:text-[#f0ede8] transition-colors">
              {item}
            </a>
          ))}
        </div>
        <p className="text-xs text-[#666666]">© 2025 BrollAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
