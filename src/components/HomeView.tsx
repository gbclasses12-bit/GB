import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  History,
  Search,
  Send,
  X,
} from 'lucide-react';
import { APP_NAME, TELEGRAM_URL } from '../data/platforms';
import { PlatformId, PlatformItem } from '../types';
import { AppLogo } from './AppLogo';
import { PlatformEmblem } from './PlatformEmblem';

interface HomeViewProps {
  platforms: PlatformItem[];
  recentPlatform: PlatformId | null;
  onOpenMenu: () => void;
  onSelectPlatform: (platform: PlatformItem) => void;
  onLogoTap: () => void;
}

export function HomeView({
  platforms,
  recentPlatform,
  onOpenMenu,
  onSelectPlatform,
  onLogoTap,
}: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlatforms = platforms.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const recentObj = recentPlatform
    ? platforms.find((p) => p.id === recentPlatform)
    : null;

  return (
    <div className="min-h-screen bg-[#050807] text-white relative overflow-x-hidden pb-14 flex flex-col justify-between">
      {/* Layered Ambient Aurora & Subtle Grid Backdrop */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[440px] rounded-full animate-aurora blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.22) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 75%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #34d399 1px, transparent 1px), linear-gradient(to bottom, #34d399 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage:
              'radial-gradient(ellipse 80% 55% at 50% 15%, black 20%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 55% at 50% 15%, black 20%, transparent 80%)',
          }}
        />
      </div>

      <div>
        {/* Top Bar: Hamburger + Quick Telegram Link */}
        <div className="sticky top-0 z-30 px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between max-w-5xl mx-auto">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="w-10 h-10 rounded-xl bg-[#0d1411]/85 backdrop-blur-md border border-emerald-500/30 hover:border-emerald-400/60 flex flex-col items-center justify-center gap-[4.5px] transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_16px_rgba(16,185,129,0.22)]"
          >
            <span className="w-4 h-[2px] rounded-full bg-emerald-400" />
            <span className="w-4 h-[2px] rounded-full bg-emerald-400" />
            <span className="w-4 h-[2px] rounded-full bg-emerald-400" />
          </button>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#0d1411]/85 backdrop-blur-md border border-sky-400/30 hover:border-sky-400/65 text-sky-400 hover:text-sky-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram</span>
          </a>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 pt-2 pb-6 sm:pb-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-4"
          >
            <div
              onClick={onLogoTap}
              className="inline-flex cursor-pointer select-none relative"
            >
              <div
                className="absolute -inset-3 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none"
                aria-hidden="true"
              />
              <AppLogo size="md" animatedZ glow />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="font-display-serif text-[38px] sm:text-[46px] lg:text-[52px] font-bold leading-[1.06] tracking-tight mb-3"
          >
            <span className="block text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.1)]">
              Welcome to
            </span>
            <span className="block bg-gradient-to-r from-[#22c55e] via-[#4ade80] to-[#10b981] bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(34,197,94,0.28)]">
              {APP_NAME}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[14.5px] sm:text-[16px] font-medium text-slate-200 tracking-wide mb-2.5"
          >
            Education Must Be{' '}
            <span className="text-[#22c55e] font-bold">Free</span> For Everyone
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11.5px] sm:text-xs text-slate-400 font-medium"
          >
            <span>{platforms.length} Platforms</span>
            <span aria-hidden="true" className="text-emerald-500/60">·</span>
            <span>HD Lectures</span>
            <span aria-hidden="true" className="text-emerald-500/60">·</span>
            <span>Notes &amp; DPPs</span>
            <span aria-hidden="true" className="text-emerald-500/60">·</span>
            <span>100% Free</span>
          </motion.div>
        </div>

        {/* Search & Continue Studying Container */}
        <div className="relative z-10 max-w-[460px] sm:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 space-y-4 mb-5">
          {/* Sleek Glass Search Bar */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#0b110e]/85 backdrop-blur-md border border-white/10 focus-within:border-emerald-500/50 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-colors">
            <Search className="w-4 h-4 text-emerald-400/80 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search platform (PW, Next Toppers, RWA...)"
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Continue Studying Spotlight Card */}
          {recentObj && !searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {recentObj.url ? (
                <a
                  href={recentObj.url}
                  onClick={() => onSelectPlatform(recentObj)}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#0d1c15]/95 via-[#0b1410]/95 to-[#0a100d]/95 border border-emerald-500/35 hover:border-emerald-400/60 p-3 sm:px-4 flex items-center justify-between gap-3 transition-all shadow-[0_8px_28px_rgba(16,185,129,0.1)] group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <PlatformEmblem
                      id={recentObj.id}
                      customIcon={recentObj.customIcon}
                      name={recentObj.name}
                      accentColor={recentObj.accentColor}
                      size="sm"
                    />
                    <div className="min-w-0 text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 leading-none mb-1">
                        Continue Studying
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-white truncate">
                        {recentObj.name}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-[11px] font-bold flex items-center gap-1 shrink-0 group-hover:bg-emerald-500 group-hover:text-[#050807] transition-colors">
                    <span>Resume</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectPlatform(recentObj)}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#0d1c15]/95 via-[#0b1410]/95 to-[#0a100d]/95 border border-emerald-500/35 hover:border-emerald-400/60 p-3 sm:px-4 flex items-center justify-between gap-3 transition-all shadow-[0_8px_28px_rgba(16,185,129,0.1)] group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <PlatformEmblem
                      id={recentObj.id}
                      customIcon={recentObj.customIcon}
                      name={recentObj.name}
                      accentColor={recentObj.accentColor}
                      size="sm"
                    />
                    <div className="min-w-0 text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 leading-none mb-1">
                        Continue Studying
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-white truncate">
                        {recentObj.name}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-[11px] font-bold flex items-center gap-1 shrink-0 group-hover:bg-emerald-500 group-hover:text-[#050807] transition-colors">
                    <span>Resume</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* Responsive Platform Grid: 2 cols Mobile, 3 cols Tablet & Laptop */}
        <div className="relative z-10 max-w-[460px] sm:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6">
          {filteredPlatforms.length === 0 ? (
            <div className="rounded-2xl bg-[#0b100d]/90 border border-white/10 p-8 text-center">
              <p className="text-sm font-semibold text-slate-200">
                No platform found for &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 px-4 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-xs font-bold cursor-pointer"
              >
                Show All Platforms
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
              {filteredPlatforms.map((platform, idx) => {
                const isRecent = recentPlatform === platform.id;
                const isLastOdd =
                  filteredPlatforms.length % 2 === 1 &&
                  idx === filteredPlatforms.length - 1;

                const cardClass = `group relative overflow-hidden rounded-2xl bg-[#0b110e]/90 backdrop-blur-md border transition-all duration-300 p-4 pt-5 pb-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.45)] ${
                  isRecent
                    ? 'border-emerald-500/65 shadow-[0_0_28px_rgba(16,185,129,0.2)]'
                    : 'border-white/10 hover:border-white/30'
                } ${
                  isLastOdd
                    ? 'col-span-2 w-[calc(50%-0.4375rem)] mx-auto sm:col-span-1 sm:w-full'
                    : ''
                }`;

                const cardInner = (
                  <>
                    {/* Top glass edge highlight */}
                    <span
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      aria-hidden="true"
                    />

                    {/* Colored hover aura behind icon */}
                    <span
                      className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full opacity-0 group-hover:opacity-25 blur-2xl transition-opacity duration-300"
                      style={{ backgroundColor: platform.accentColor }}
                      aria-hidden="true"
                    />

                    {/* Diagonal shine sweep on hover */}
                    <span
                      className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent skew-x-12"
                      aria-hidden="true"
                    />

                    {isRecent && (
                      <span className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/45 text-[9.5px] font-bold tracking-wider text-emerald-400 uppercase">
                        <History className="w-2.5 h-2.5" />
                        RECENT
                      </span>
                    )}

                    <div className="relative z-10 mb-3 transition-transform duration-300 group-hover:scale-105">
                      <PlatformEmblem
                        id={platform.id}
                        customIcon={platform.customIcon}
                        name={platform.name}
                        accentColor={platform.accentColor}
                        size="lg"
                      />
                    </div>

                    <span className="relative z-10 text-[13.5px] sm:text-sm font-semibold text-slate-100 group-hover:text-white leading-snug">
                      {platform.name}
                    </span>

                    <span className="relative z-10 mt-1 text-[10.5px] font-semibold text-emerald-400/0 group-hover:text-emerald-400/90 transition-colors duration-200 flex items-center gap-1">
                      <span>Open</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </>
                );

                if (platform.url) {
                  return (
                    <motion.a
                      key={platform.id}
                      href={platform.url}
                      onClick={() => onSelectPlatform(platform)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.32,
                        delay: 0.04 * idx,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileTap={{ scale: 0.97 }}
                      className={cardClass}
                    >
                      {cardInner}
                    </motion.a>
                  );
                }

                return (
                  <motion.button
                    key={platform.id}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.32,
                      delay: 0.04 * idx,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectPlatform(platform)}
                    className={cardClass}
                  >
                    {cardInner}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Clean Minimal Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto px-4 pt-10 text-center">
        <div className="h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-300">{APP_NAME}</span> ·{' '}
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            Join Official Telegram
          </a>
        </p>
      </footer>
    </div>
  );
}
