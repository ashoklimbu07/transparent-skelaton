import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <header className="border-b border-[#252525] bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-['Bebas_Neue'] text-[28px] tracking-[1px] leading-none text-[#f0ede8]">
            Video Scene Analyzer
            <span className="ml-2 align-middle font-sans text-[10px] font-semibold uppercase tracking-[0.5px] text-[#9a9a9a] bg-[#171717] px-2 py-0.5 rounded border border-[#2a2a2a]">
              Powered by Gemini
            </span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
