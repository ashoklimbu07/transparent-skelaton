import { WorkspaceLayout } from './WorkspaceLayout';

type WorkspacePlaceholderPageProps = {
  title: string;
  message?: string;
};

export function WorkspacePlaceholderPage({
  title,
  message = 'This page is ready. We will build the full feature here next.',
}: WorkspacePlaceholderPageProps) {
  return (
    <WorkspaceLayout>
      <section className="w-full border border-[#222222] bg-[#111111] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <h1 className="font-['Bebas_Neue'] text-[34px] tracking-[1px] text-[#f0ede8]">{title}</h1>
        <p className="mt-3 text-sm text-[#9a9a9a]">{message}</p>
      </section>
    </WorkspaceLayout>
  );
}
