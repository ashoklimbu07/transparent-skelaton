import React from 'react';
import { History, Clock, X } from 'lucide-react';
import type { Session } from '../types';

interface HistoryPanelProps {
  history: Session[];
  onLoadSession: (session: Session) => void;
  onDeleteSession: (sessionId: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoadSession, onDeleteSession }) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-[#121212] border border-[#2a2a2a] rounded-[10px] overflow-hidden p-6">
      <div className="flex items-center gap-2 mb-3 text-[#b7b7b7] font-medium">
        <History className="w-4 h-4 text-[#ff7d58]" />
        <span>Recent Sessions</span>
      </div>
      <p className="text-[11px] text-[#7e7e7e] mb-3">
        Click a session to load. X to delete.
      </p>
      <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
        {history.map((session) => (
          <div
            key={session.id}
            className="w-full text-left p-3 rounded-md bg-[#171717] border border-[#252525] hover:border-[#ff5a2f]/40 hover:bg-[#1b1b1b] transition-colors group"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <button
                type="button"
                onClick={() => onLoadSession(session)}
                className="flex-1 text-left min-w-0"
              >
                <span className="text-xs font-semibold text-[#8f8f8f] group-hover:text-[#ff7d58] uppercase block">
                  {session.type}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteSession(session.id)}
                className="p-1 rounded text-[#666666] hover:text-red-400 hover:bg-[#272727] transition-colors"
                aria-label={`Delete session ${session.name}`}
                title="Delete session"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onLoadSession(session)}
              className="w-full text-left"
            >
              <p className="text-xs text-[#d0d0d0] truncate" title={session.name}>
                {session.name}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-[#7a7a7a]">
                  {session.scenes.length} scenes
                </p>
                <div className="flex items-center gap-1 text-[10px] text-[#666666]">
                  <Clock className="w-3 h-3" />
                  {new Date(session.timestamp).toLocaleDateString()}
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
