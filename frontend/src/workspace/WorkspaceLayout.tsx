import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { accountNavItems, extraNavItems, toolsNavItems, type WorkspaceNavItem } from './navigation';
import { useAuth } from '../auth/AuthContext';

type WorkspaceLayoutProps = {
  children: ReactNode;
};

function NavSection({
  title,
  items,
  currentPath,
  onNavigate,
}: {
  title: string;
  items: WorkspaceNavItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
}) {
  return (
    <section className="space-y-2">
      <p className="px-3 pb-1.5 pt-1 text-[10px] uppercase tracking-[3px] text-[#555555]">{title}</p>
      {items.map((item) => {
        const isActive = currentPath === item.path;

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => onNavigate(item.path)}
            className={`relative flex w-full items-center gap-2.5 rounded-md px-4 py-3 text-left text-[13px] transition-colors ${
              isActive ? 'bg-[#e8380d]/12 text-[#f0ede8]' : 'text-[#888888] hover:bg-[#181818]'
            }`}
          >
            <item.icon size={14} />
            <span>{item.label}</span>
            {isActive ? <span className="absolute -left-3 top-1 bottom-1 w-[3px] rounded-r bg-[#e8380d]" /> : null}
          </button>
        );
      })}
    </section>
  );
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentPath = location.pathname === '/generate' ? '/tools/generate' : location.pathname;
  const displayName = user?.name || 'User Profile';
  const userInitial = displayName.trim().charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#f0ede8] font-['DM_Sans']">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap"
      />

      <div className="relative z-10 flex min-h-screen items-stretch">
        <aside className="hidden min-h-screen shrink-0 flex-col border-r border-[#252525] bg-[#0f0f0f] lg:flex lg:w-[240px] xl:w-[260px] 2xl:w-[280px]">
          <div className="border-b border-[#252525] px-5 py-5">
            <div className="flex items-center gap-2.5">
              <p className="font-['Bebas_Neue'] text-[24px] tracking-[1.5px]">
                Broll<span className="text-[#e8380d]">AI</span>
              </p>
              <span className="border border-[#e8380d]/25 bg-[#e8380d]/12 px-2 py-0.5 text-[9px] uppercase tracking-[2px] text-[#e8380d]">
                Beta
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
            <NavSection title="Tools" items={toolsNavItems} currentPath={currentPath} onNavigate={navigate} />

            <div className="mx-0.5 h-px bg-[#252525]" />
            <NavSection title="Extra" items={extraNavItems} currentPath={currentPath} onNavigate={navigate} />

            <div className="mx-0.5 h-px bg-[#252525]" />
            <NavSection title="Account" items={accountNavItems} currentPath={currentPath} onNavigate={navigate} />
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#252525] px-4 py-2 sm:px-6 lg:px-8">
            <p className="font-['Bebas_Neue'] text-[18px] tracking-[2px] text-[#888888]">
              Creator <span className="text-[#f0ede8]">Workspace</span>
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#151515] px-2 py-1.5 text-xs text-[#b1b1b1]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#242424] text-[11px] font-semibold text-[#f0ede8]">
                {userInitial}
              </span>
              <span className="max-w-[120px] truncate pr-1">{displayName}</span>
              <button
                type="button"
                onClick={() => {
                  void logout().then(() => navigate('/login', { replace: true }));
                }}
                className="rounded border border-[#323232] px-2 py-1 text-[10px] uppercase tracking-[1px] text-[#cfcfcf] hover:border-[#ff5a2f] hover:text-white"
              >
                Logout
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-9">{children}</div>
        </main>
      </div>
    </div>
  );
}
