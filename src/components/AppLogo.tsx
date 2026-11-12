import { useState } from 'react';
import { APP_ICON_URL, APP_NAME } from '../data/platforms';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animatedZ?: boolean;
  glow?: boolean;
  className?: string;
}

export function AppLogo({
  size = 'md',
  animatedZ = false,
  glow = false,
  className = '',
}: AppLogoProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-24 h-24 rounded-3xl',
    lg: 'w-24 h-24 rounded-3xl',
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div
          className="absolute inset-0 rounded-2xl bg-emerald-500/30 blur-xl pointer-events-none"
          aria-hidden="true"
        />
      )}

      <div
        className={`relative ${sizeClasses} overflow-hidden bg-[#0e1512] border border-emerald-500/25 flex items-center justify-center shadow-lg ${
          animatedZ ? 'animate-breathe' : ''
        }`}
      >
        {!imgError ? (
          <img
            src={APP_ICON_URL}
            alt={APP_NAME}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-emerald-900/40 flex items-center justify-center text-emerald-400 font-bold text-sm tracking-tight">
            GB
          </div>
        )}
      </div>

      {animatedZ && (
        <div
          className="absolute -top-2 -right-2 pointer-events-none select-none"
          aria-hidden="true"
        >
          <span className="absolute text-[11px] font-bold text-emerald-400 animate-float-z1">
            z
          </span>
          <span className="absolute left-2 -top-1 text-[13px] font-bold text-emerald-300 animate-float-z2">
            z
          </span>
        </div>
      )}
    </div>
  );
}
