import { Minus, Plus } from 'lucide-react';
import type { ManualCharacter } from './manualStory.types';
import { CHARACTER_SLOTS } from './manualStory.utils';

type CharactersSectionProps = {
  characters: ManualCharacter[];
  isGenerating: boolean;
  enabledSlotsCount: number;
  onResetAll: () => void;
  onEnableSlot: (index: number) => void;
  onDisableSlot: (index: number) => void;
  onChangeDetail: (index: number, detail: string) => void;
};

export function CharactersSection({
  characters,
  isGenerating,
  enabledSlotsCount,
  onResetAll,
  onEnableSlot,
  onDisableSlot,
  onChangeDetail,
}: CharactersSectionProps) {
  return (
    <div className="rounded-[4px] border border-[#2f2f2f] bg-[#121212] p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#f0ede8]">Characters</h2>
        <button
          type="button"
          disabled={isGenerating}
          onClick={onResetAll}
          className="rounded border border-[#3a2a25] bg-[#1a1210] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.7px] text-[#ff9f86] transition-colors hover:border-[#ff5a2f] hover:text-[#ffd4c7] disabled:cursor-not-allowed disabled:opacity-50"
          title="Clear all character details"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2">
        {characters
          .map((ch, idx) => ({ ch, idx, slot: idx + 1 }))
          .filter(({ ch }) => ch.enabled)
          .map(({ ch, idx, slot }) => (
            <div key={slot} className="rounded border border-[#222222] bg-[#0e0e0e] p-2.5">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#888888]">c{slot}</span>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => onDisableSlot(idx)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#252525] bg-[#161616] text-[#ff8c6a] hover:bg-[#20110d] hover:text-[#ffb8a3] disabled:cursor-not-allowed disabled:opacity-50"
                  title="Remove character"
                  aria-label={`Remove character c${slot}`}
                >
                  <Minus size={16} />
                </button>
              </div>

              <textarea
                rows={1}
                value={ch.detail}
                onChange={(e) => onChangeDetail(idx, e.target.value)}
                placeholder="e.g. man in red tshirt, black pant, white sneakers"
                className="mt-1 w-full resize-y rounded border border-[#2f2f2f] bg-[#161616] p-2 text-sm text-[#f0ede8] outline-none transition-colors focus:border-[#ff5a2f]"
                disabled={isGenerating}
              />
            </div>
          ))}
      </div>

      {characters.some((c) => !c.enabled) ? (
        <div className="mt-3 rounded-[4px] border border-[#2f2f2f] bg-[#0e0e0e] p-2.5">
          <div className="flex flex-wrap gap-2">
            {characters.map((ch, idx) => {
              if (ch.enabled) return null;
              const slot = idx + 1;
              const atMax = enabledSlotsCount >= CHARACTER_SLOTS;

              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isGenerating || atMax}
                  onClick={() => onEnableSlot(idx)}
                  className="inline-flex h-8 items-center gap-2 rounded border border-[#252525] bg-[#161616] px-2.5 text-[#888888] hover:border-[#e8380d]/60 hover:text-[#f0ede8] disabled:cursor-not-allowed disabled:opacity-50"
                  title={atMax ? `Max ${CHARACTER_SLOTS} characters` : `Add character c${slot}`}
                  aria-label={`Add character c${slot}`}
                >
                  <Plus size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-[2px]">{`c${slot}`}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
