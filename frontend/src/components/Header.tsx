import { BackendWakeButton } from './BackendWakeButton';

export const Header = () => {
  return (
    <div className="text-center border-b border-[#222222] pb-6">
      <p className="text-[11px] tracking-[4px] uppercase text-[#ff3c00] mb-3">Generator</p>
      <h1 className="font-['Bebas_Neue'] text-[44px] leading-none tracking-[1px] mb-2">
        B-Roll Generator
      </h1>
      <p className="text-[#888888] text-base">
        Transform your script into cinematic visuals automatically.
      </p>
      <BackendWakeButton />
    </div>
  );
};
