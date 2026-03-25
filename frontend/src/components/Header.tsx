import { BackendWakeButton } from './BackendWakeButton';

export const Header = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
        B-Roll Generator
      </h1>
      <p className="text-slate-500 text-lg">
        Transform your script into cinematic visuals automatically.
      </p>
      <BackendWakeButton />
    </div>
  );
};
