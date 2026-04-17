import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { WorkspaceLayout } from '../../workspace/WorkspaceLayout';

export function AccountSettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const fullName = user?.name?.trim() || '';
  const [firstName = 'User'] = fullName.split(/\s+/).filter(Boolean);
  const displayName = fullName || firstName;
  const email = user?.email?.trim() || 'No email available';
  const userInitial = firstName.charAt(0).toUpperCase() || 'U';
  const profilePicture = user?.picture?.trim() || '';

  return (
    <WorkspaceLayout>
      <section className="relative w-full overflow-hidden border border-[#232323] bg-[linear-gradient(180deg,_#131313_0%,_#0d0d0d_100%)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-6 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(255,60,0,0.2)_0%,_rgba(255,60,0,0)_70%)]" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(255,90,40,0.14)_0%,_rgba(255,90,40,0)_72%)]" />

        <div className="relative">
          <p className="text-[11px] uppercase tracking-[2.5px] text-[#ff7b57]">Account</p>
          <h1 className="mt-2 font-['Bebas_Neue'] text-[32px] tracking-[1.2px] text-[#f0ede8] sm:text-[36px]">Settings</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#9f9f9f]">
            Manage your signed-in profile details and account session.
          </p>
        </div>

        <div className="relative mt-7 border-t border-[#232323] pt-6">
          <div className="flex items-center gap-4 border-b border-[#232323] pb-5">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={`${displayName} profile`}
                className="h-14 w-14 shrink-0 rounded-full border border-[#2d2d2d] object-cover shadow-[0_0_0_3px_rgba(255,255,255,0.03)]"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#2d2d2d] bg-[#1a1a1a] text-lg font-semibold text-[#f0ede8] shadow-[0_0_0_3px_rgba(255,255,255,0.03)]">
                {userInitial}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-[#f0ede8]">{displayName}</p>
              <p className="truncate text-sm text-[#a0a0a0]">{email}</p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-[#262626] bg-[linear-gradient(180deg,_#181818_0%,_#141414_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <dt className="text-[11px] uppercase tracking-[2px] text-[#777777]">Name</dt>
              <dd className="mt-1 text-sm font-medium text-[#ececec]">{displayName}</dd>
            </div>
            <div className="rounded-md border border-[#262626] bg-[linear-gradient(180deg,_#181818_0%,_#141414_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <dt className="text-[11px] uppercase tracking-[2px] text-[#777777]">Email</dt>
              <dd className="mt-1 break-all text-sm font-medium text-[#ececec]">{email}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                void logout().then(() => navigate('/login', { replace: true }));
              }}
              className="inline-flex items-center justify-center rounded border border-[#7a2a17] bg-[linear-gradient(180deg,_#7a2e1a_0%,_#5d2012_100%)] px-4 py-2 text-xs font-semibold uppercase tracking-[1px] text-[#ffe1d8] shadow-[0_8px_20px_rgba(255,90,40,0.16)] transition-all hover:-translate-y-[1px] hover:border-[#ff5a28] hover:bg-[linear-gradient(180deg,_#9a351c_0%,_#752714_100%)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101010]"
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    </WorkspaceLayout>
  );
}
