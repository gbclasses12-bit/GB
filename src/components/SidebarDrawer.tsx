import { AnimatePresence, motion } from 'motion/react';
import { Home, X } from 'lucide-react';
import { APP_NAME } from '../data/platforms';
import { PlatformId, PlatformItem } from '../types';
import { AppLogo } from './AppLogo';
import { PlatformEmblem } from './PlatformEmblem';

interface SidebarDrawerProps {
  isOpen: boolean;
  activePage: PlatformId;
  platforms: PlatformItem[];
  onClose: () => void;
  onSelectPage: (id: PlatformId) => void;
  onSelectPlatform: (platform: PlatformItem) => void;
  onLogoTap: () => void;
}

export function SidebarDrawer({
  isOpen,
  activePage,
  platforms,
  onClose,
  onSelectPage,
  onSelectPlatform,
  onLogoTap,
}: SidebarDrawerProps) {
  const handleHome = () => {
    onSelectPage('home');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-[2px]"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[285px] max-w-[82vw] h-full bg-[#0b0e0c] border-r border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between">
              <div
                onClick={onLogoTap}
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <AppLogo size="sm" />
                <span className="font-display-serif text-xl font-bold text-white tracking-tight">
                  {APP_NAME}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
              <button
                type="button"
                onClick={handleHome}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'home'
                    ? 'bg-[#0c3823] text-emerald-400 border border-emerald-500/35'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <span className="w-7 h-7 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </span>
                <span>Home</span>
              </button>

              {platforms.map((platform) => {
                const isActive = activePage === platform.id;
                const itemClass = `w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0c3823] text-emerald-400 border border-emerald-500/35'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`;

                if (platform.url) {
                  return (
                    <a
                      key={platform.id}
                      href={platform.url}
                      onClick={() => {
                        onSelectPlatform(platform);
                        onClose();
                      }}
                      className={itemClass}
                    >
                      <PlatformEmblem
                        id={platform.id}
                        customIcon={platform.customIcon}
                        name={platform.name}
                        size="sm"
                      />
                      <span className="truncate">{platform.sidebarName}</span>
                    </a>
                  );
                }

                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => {
                      onSelectPlatform(platform);
                      onClose();
                    }}
                    className={itemClass}
                  >
                    <PlatformEmblem
                      id={platform.id}
                      customIcon={platform.customIcon}
                      name={platform.name}
                      size="sm"
                    />
                    <span className="truncate">{platform.sidebarName}</span>
                  </button>
                );
              })}
            </nav>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
