import { BackendWakeButton } from './BackendWakeButton';

export const Header = () => {
  return (
    <div className="text-center border-b border-[#222222] pb-6">
      <p className="mb-3 text-[10px] uppercase tracking-[3px] text-[#ff3c00] sm:text-[11px] sm:tracking-[4px]">Generator</p>
      <h1 className="mb-2 font-['Bebas_Neue'] text-[34px] leading-none tracking-[1px] sm:text-[44px]">
        B-Roll Generator
      </h1>
      <p className="text-sm text-[#888888] sm:text-base">
        Transform your script into cinematic visuals automatically.
      </p>
      <BackendWakeButton />
    </div>
  );
};
