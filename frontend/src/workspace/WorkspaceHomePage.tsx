import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { accountNavItems, extraNavItems, toolsNavItems, type WorkspaceNavItem } from './navigation';
import { WorkspaceLayout } from './WorkspaceLayout';

function NavGroup({ title, items }: { title: string; items: WorkspaceNavItem[] }) {
  return (
    <section className="border border-[#252525] bg-[#121212] p-5">
      <p className="text-[11px] uppercase tracking-[2px] text-[#7a7a7a]">{title}</p>
      <div className="mt-4 space-y-2.5">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-2.5 border border-[#232323] bg-[#171717] px-3 py-2 text-sm text-[#b7b7b7] transition-colors hover:border-[#e8380d]/60 hover:text-[#f0ede8]"
          >
            <item.icon size={14} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function WorkspaceHomePage() {
  const { user } = useAuth();
  const displayName = user?.name?.trim() || 'Creator';
  const firstName = displayName.split(' ')[0] || displayName;

  return (
    <WorkspaceLayout>
      <section className="w-full border border-[#222222] bg-[#111111] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6 md:p-8">
        <p className="text-xs uppercase tracking-[2px] text-[#ff7b57]">Hello, {firstName}</p>
        <p className="mt-1 text-sm text-[#b7b7b7]">Welcome back. BrollAI is glad to have you here.</p>
        <h1 className="font-['Bebas_Neue'] text-[30px] tracking-[1px] text-[#f0ede8] sm:text-[36px]">
          Choose Your Workspace Page
        </h1>
        <p className="mt-2 text-sm text-[#9a9a9a]">
          Pick a tool, extra section, or account page from here or from the left navigation.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <NavGroup title="Tools" items={toolsNavItems} />
          <NavGroup title="Extra" items={extraNavItems} />
          <NavGroup title="Account" items={accountNavItems} />
        </div>
      </section>
    </WorkspaceLayout>
  );
}
