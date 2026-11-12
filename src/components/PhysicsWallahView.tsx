import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  LogIn,
  Menu,
  Moon,
  Search,
  Send,
  Smartphone,
  Sun,
} from 'lucide-react';
import { APP_NAME, BATCHES, TELEGRAM_URL } from '../data/platforms';
import { BatchItem } from '../types';

interface PhysicsWallahViewProps {
  onOpenMenu: () => void;
  onBack: () => void;
  onSelectBatch: (batch: BatchItem) => void;
}

export function PhysicsWallahView({
  onOpenMenu,
  onBack,
  onSelectBatch,
}: PhysicsWallahViewProps) {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPromo, setShowPromo] = useState(true);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [mobileInput, setMobileInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const pwBatches = BATCHES.filter(
    (b) =>
      b.platformId === 'pw' &&
      (b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.classTag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mobileInput.trim().length >= 10) {
      setOtpSent(true);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 pb-16 ${
        isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f4f6fb] text-slate-900'
      }`}
    >
      {/* Top Bar matching video 00:28 */}
      <header
        className={`sticky top-0 z-30 border-b px-3 sm:px-6 py-3 ${
          isDark
            ? 'bg-[#0f172a]/95 border-slate-800'
            : 'bg-white/95 border-slate-200'
        } backdrop-blur-md`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Open menu"
              className={`w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Menu className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onBack}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle theme"
              className={`w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700'
                  : 'border-amber-200 bg-amber-50 text-amber-500 hover:bg-amber-100'
              }`}
            >
              {isDark ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowLoginCard(!showLoginCard)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl lg:max-w-5xl mx-auto px-4 sm:px-6 pt-5 space-y-5">
        {/* Explore Batches Header */}
        <div>
          <span
            className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md mb-2 ${
              isDark
                ? 'bg-indigo-500/20 text-indigo-300'
                : 'bg-indigo-50 text-indigo-600'
            }`}
          >
            Premium Education Platform
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">
            Explore Batches
          </h1>
          <p
            className={`text-xs leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Select your goal, access live classes, lecture videos, notes &amp;
            DPPs completely free.
          </p>
        </div>

        {/* Search Bar */}
        <div
          className={`flex items-center gap-2 p-1.5 rounded-xl border ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search batches by..."
            className="flex-1 bg-transparent text-sm outline-none py-1.5 px-1"
          />
          <button
            type="button"
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Search
          </button>
        </div>

        {/* Join Telegram Community Promo Card matching video 00:29 */}
        {showPromo && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-4 text-center relative overflow-hidden ${
              isDark
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-sky-500/15 text-sky-500 flex items-center justify-center mx-auto mb-2">
              <Send className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold mb-2">
              Join Telegram Community!
            </h2>
            <div className="rounded-xl bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#0f172a] text-white p-3.5 mb-3 text-left">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500 text-white">
                  30% OFF · FREE HERE
                </span>
                <span className="text-[10px] text-indigo-200">
                  Class 11th &amp; 12th
                </span>
              </div>
              <p className="text-sm font-extrabold">
                ARJUNA &amp; LAKSHYA BATCHES 2026
              </p>
              <p className="text-[11px] text-indigo-200">
                All lectures, notes &amp; DPPs unlocked via {APP_NAME}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowPromo(false)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Maybe Later
              </button>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Join Now</span>
              </a>
            </div>
          </motion.div>
        )}

        {/* Available Courses & Batches */}
        <div>
          <h2 className="text-base font-bold mb-3">
            Available Courses &amp; Batches
          </h2>

          {pwBatches.length === 0 ? (
            <div
              className={`rounded-2xl border p-8 text-center ${
                isDark
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Search className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold">No batches found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try clearing your search query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {pwBatches.map((batch) => (
                <div
                  key={batch.id}
                  className={`rounded-2xl border overflow-hidden transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50'
                      : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div
                    className={`h-24 bg-gradient-to-br ${batch.bannerBg} p-3.5 flex flex-col justify-between text-white`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 w-fit px-2 py-0.5 rounded">
                      {batch.classTag}
                    </span>
                    <p className="text-base font-extrabold leading-tight">
                      {batch.title}
                    </p>
                  </div>
                  <div className="p-3.5 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-slate-400">
                        Price
                      </p>
                      <p className="text-sm font-extrabold text-emerald-500">
                        FREE
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectBatch(batch)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Study</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Login / Signup Card matching video 00:30 */}
        <div
          id="pw-login-card"
          className={`rounded-2xl border p-5 text-center ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Smartphone className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold mb-1">
            Get Best Experience For Learning
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Login or Signup to {APP_NAME} to sync your favorite batches &amp;
            notes.
          </p>

          <form
            onSubmit={handleLoginSubmit}
            className="max-w-xs mx-auto space-y-2.5 text-left"
          >
            <label className="block text-[11px] font-semibold text-slate-400">
              Enter Mobile Number
            </label>
            <div
              className={`flex items-center rounded-xl border px-3 py-2 ${
                isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-xs font-bold text-slate-400 mr-2">+91</span>
              <input
                type="tel"
                value={mobileInput}
                onChange={(e) => {
                  setMobileInput(e.target.value);
                  setOtpSent(false);
                }}
                placeholder="Mobile Number"
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-colors"
            >
              {otpSent ? 'OTP Sent! Check Telegram / SMS' : 'Get Instant OTP'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
