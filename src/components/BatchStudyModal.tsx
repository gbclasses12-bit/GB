import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  FileText,
  Play,
  Send,
  X,
} from 'lucide-react';
import { TELEGRAM_URL } from '../data/platforms';
import { BatchItem, LectureItem } from '../types';

interface BatchStudyModalProps {
  batch: BatchItem | null;
  onClose: () => void;
}

export function BatchStudyModal({ batch, onClose }: BatchStudyModalProps) {
  const [activeLecture, setActiveLecture] = useState<LectureItem | null>(null);

  if (!batch) return null;

  const currentLecture = activeLecture || batch.lectures[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#0b100d] border border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#0b100d]/95 backdrop-blur-md px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                {batch.classTag} · FREE ACCESS
              </p>
              <h2 className="text-base font-extrabold text-white truncate">
                {batch.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close batch viewer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Player Preview */}
          <div className="p-5 space-y-4">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#0e1a14] to-[#060a08] border border-emerald-500/25 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 flex items-center justify-center mb-3 shadow-[0_0_24px_rgba(16,185,129,0.25)]">
                <Play className="w-6 h-6 fill-emerald-400 ml-0.5" />
              </div>
              <p className="text-sm font-bold text-white mb-1">
                {currentLecture.title}
              </p>
              <p className="text-xs text-slate-400">
                {currentLecture.subject} · {currentLecture.duration}
              </p>
            </div>

            {/* Lectures List */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Lectures &amp; Study Material
              </h3>
              <div className="space-y-2">
                {batch.lectures.map((lec) => {
                  const isSelected = currentLecture.id === lec.id;
                  return (
                    <button
                      key={lec.id}
                      type="button"
                      onClick={() => setActiveLecture(lec)}
                      className={`w-full text-left rounded-xl p-3 border flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#0d2e1e] border-emerald-500/45'
                          : 'bg-[#101613] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-emerald-500 text-[#060a08]'
                              : 'bg-white/5 text-slate-300'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {lec.title}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {lec.subject} · {lec.duration}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {lec.hasNotes && (
                          <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-semibold text-slate-300 flex items-center gap-1">
                            <FileText className="w-3 h-3 text-emerald-400" />
                            Notes
                          </span>
                        )}
                        {lec.hasDpp && (
                          <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-semibold text-slate-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                            DPP
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Telegram Support Footer */}
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2692dc] to-[#38bdf8] hover:brightness-110 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>JOIN GB STUDY TELEGRAM FOR PDF &amp; LIVE UPDATES</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
