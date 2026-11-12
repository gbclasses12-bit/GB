import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Menu,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { BATCHES } from '../data/platforms';
import { BatchItem, PlatformId, PlatformItem } from '../types';

interface NextToppersViewProps {
  platformId: PlatformId;
  platforms: PlatformItem[];
  wishlist: string[];
  onToggleWishlist: (batchId: string) => void;
  onOpenMenu: () => void;
  onBack: () => void;
  onSelectBatch: (batch: BatchItem) => void;
}

export function NextToppersView({
  platformId,
  platforms,
  wishlist,
  onToggleWishlist,
  onOpenMenu,
  onBack,
  onSelectBatch,
}: NextToppersViewProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'old' | 'wishlist'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');

  const platform = platforms.find((p) => p.id === platformId);
  const platformNameParts = (platform?.name || 'NEXT TOPPERS')
    .toUpperCase()
    .split(' ');
  const firstWord = platformNameParts[0];
  const restWords = platformNameParts.slice(1).join(' ');

  const platformBatches = BATCHES.filter((b) => b.platformId === platformId);

  const filteredBatches = platformBatches.filter((batch) => {
    const matchesTab =
      activeTab === 'wishlist'
        ? wishlist.includes(batch.id)
        : batch.category === activeTab ||
          (activeTab === 'new' && platformBatches.length <= 2);

    const matchesSearch =
      batch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.classTag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      classFilter === 'all' ||
      batch.classTag.toLowerCase().includes(classFilter.toLowerCase());

    return matchesTab && matchesSearch && matchesClass;
  });

  const cycleClassFilter = () => {
    const order = ['all', '10th', '9th', '8th', '7th'];
    const nextIdx = (order.indexOf(classFilter) + 1) % order.length;
    setClassFilter(order[nextIdx]);
  };

  return (
    <div className="min-h-screen bg-[#060a08] text-white relative overflow-x-hidden pb-16">
      {/* Top Emerald Ambient Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 35% at 50% 0%, rgba(16, 185, 129, 0.14), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl lg:max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        {/* Top Row: Hamburger + Back */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="w-10 h-10 rounded-xl bg-[#0d1411] border border-emerald-500/25 hover:border-emerald-400/50 flex items-center justify-center text-emerald-400 cursor-pointer transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-[#0d1411] border border-white/10 hover:border-white/25 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>

        {/* Condensed Uppercase 2-Tone Heading matching video 00:32 */}
        <h1 className="font-condensed text-[38px] sm:text-[44px] font-extrabold uppercase tracking-wide leading-none mb-4">
          <span className="text-white">{firstWord} </span>
          {restWords && <span className="text-[#22c55e]">{restWords}</span>}
        </h1>

        {/* Filter Tabs: New Batches | Old Batches | Wishlist */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          {(
            [
              { id: 'new', label: 'New Batches' },
              { id: 'old', label: 'Old Batches' },
              { id: 'wishlist', label: 'Wishlist' },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#060a08] shadow-sm'
                    : 'bg-[#0e1411] text-slate-300 border border-white/10 hover:border-white/25'
                }`}
              >
                {tab.label}
                {tab.id === 'wishlist' && wishlist.length > 0
                  ? ` (${wishlist.length})`
                  : ''}
              </button>
            );
          })}
        </div>

        {/* Search + Filter Bar */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#0c120f] border border-white/10 focus-within:border-emerald-500/50 transition-colors">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by class, batch..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={cycleClassFilter}
            title={`Filter: ${classFilter}`}
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
              classFilter !== 'all'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : 'bg-[#0c120f] border-white/10 text-slate-300 hover:border-white/25'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Batch Grid matching video 00:32 - 00:36 */}
        {filteredBatches.length === 0 ? (
          <div className="rounded-2xl bg-[#0b100d] border border-white/10 p-10 text-center">
            <p className="text-sm font-semibold text-slate-200 mb-1">
              {activeTab === 'wishlist'
                ? 'No batches in your wishlist yet'
                : 'No batches match your filter'}
            </p>
            <p className="text-xs text-slate-500">
              {activeTab === 'wishlist'
                ? 'Tap the heart icon on any batch to save it here.'
                : 'Try switching tabs or clearing your search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredBatches.map((batch, idx) => {
              const isWishlisted = wishlist.includes(batch.id);
              return (
                <motion.div
                  key={batch.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.04 * idx }}
                  className="rounded-2xl bg-[#0b100d] border border-white/10 hover:border-emerald-500/35 overflow-hidden flex flex-col justify-between transition-colors"
                >
                  {/* Card Visual Banner */}
                  <div
                    className={`relative h-28 sm:h-32 bg-gradient-to-br ${batch.bannerBg} p-3 flex flex-col justify-between`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/45 text-white/90 border border-white/10">
                        {batch.classTag}
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleWishlist(batch.id)}
                        aria-label="Toggle wishlist"
                        className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 border border-white/15 flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isWishlisted
                              ? 'fill-rose-500 text-rose-500'
                              : 'text-white/80'
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <p
                        className={`font-condensed text-lg sm:text-xl font-extrabold uppercase leading-none ${batch.bannerAccent}`}
                      >
                        {batch.badgeText || batch.title}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 flex-1 flex flex-col justify-between gap-3">
                    <h2 className="text-[11.5px] sm:text-xs font-extrabold uppercase tracking-wide text-white leading-snug line-clamp-2">
                      {batch.title}
                    </h2>

                    <div className="flex items-end justify-between gap-1.5 pt-1 border-t border-white/5">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 leading-none mb-0.5">
                          PRICE
                        </p>
                        <p className="text-xs sm:text-sm font-extrabold text-[#22c55e] leading-none">
                          FREE
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectBatch(batch)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0d2e1e] hover:bg-[#123d28] border border-emerald-500/45 text-emerald-400 text-[10.5px] font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>STUDY</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
