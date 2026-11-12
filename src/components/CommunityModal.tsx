import { AnimatePresence, motion } from 'motion/react';
import { Send, X } from 'lucide-react';
import { MEMBER_COUNT, TELEGRAM_URL } from '../data/platforms';
import { AppLogo } from './AppLogo';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommunityModal({ isOpen, onClose }: CommunityModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 14 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[340px] rounded-[24px] bg-[#11171c] border border-white/10 p-6 pt-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.8)]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex justify-center mb-4">
              <AppLogo size="lg" glow />
            </div>

            <h2 className="font-display-serif text-[26px] font-bold text-white tracking-tight mb-2.5">
              Join Community!
            </h2>

            <p className="text-[13.5px] leading-relaxed text-slate-400 mb-5 px-1">
              This site can be banned anytime. Please join our channel for latest
              updates and direct support.
            </p>

            <div className="w-full rounded-xl bg-black/45 border border-white/10 py-2.5 px-4 mb-5 flex items-center justify-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="text-sm font-bold text-white tabular-nums">
                {MEMBER_COUNT}
              </span>
            </div>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#2692dc] to-[#38bdf8] hover:brightness-110 active:scale-[0.98] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(56,189,248,0.28)] transition-all"
            >
              <span>JOIN TELEGRAM</span>
              <Send className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
