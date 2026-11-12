import { useState } from 'react';
import { PlatformId } from '../types';

interface PlatformEmblemProps {
  id: PlatformId;
  customIcon?: string;
  name?: string;
  accentColor?: string;
  size?: 'sm' | 'lg';
}

const DEFAULT_ACCENTS: Record<string, string> = {
  pw: '#ffffff',
  'next-toppers': '#22d3ee',
  'mission-jeet': '#ef4444',
  'science-fun': '#facc15',
  'master-sahab': '#38bdf8',
  vibrant: '#fbbf24',
  books: '#10b981',
  unc: '#34d399',
  rwa: '#ef4444',
};

export function PlatformEmblem({
  id,
  customIcon,
  name,
  accentColor,
  size = 'lg',
}: PlatformEmblemProps) {
  const [imgError, setImgError] = useState(false);
  const isSm = size === 'sm';
  const color = accentColor || DEFAULT_ACCENTS[id] || '#10b981';

  const renderInner = () => {
    if (customIcon && !imgError) {
      return (
        <img
          src={customIcon}
          alt={name || id}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      );
    }

    switch (id) {
      case 'pw':
        return (
          <div className="w-full h-full bg-[#050505] flex items-center justify-center">
            <div
              className={`${
                isSm ? 'w-5 h-5 border' : 'w-12 h-12 border-2'
              } rounded-full border-white/90 flex items-center justify-center`}
            >
              <span
                className={`font-serif font-extrabold text-white leading-none tracking-tighter ${
                  isSm ? 'text-[8px]' : 'text-lg'
                }`}
              >
                PW
              </span>
            </div>
          </div>
        );

      case 'next-toppers':
        return (
          <div className="w-full h-full bg-[#06090c] flex items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              className={isSm ? 'w-5 h-5' : 'w-12 h-12'}
              fill="none"
            >
              <path
                d="M16 14L38 32L16 50V39L26 32L16 25V14Z"
                fill="#22d3ee"
              />
              <path
                d="M30 14L52 32L30 50V39L40 32L30 25V14Z"
                fill="#06b6d4"
                opacity="0.85"
              />
            </svg>
          </div>
        );

      case 'mission-jeet':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#991b1b] to-[#450a0a] flex flex-col items-center justify-center">
            <span
              className={`font-bold text-white/90 leading-none ${
                isSm ? 'text-[6px]' : 'text-[10px]'
              }`}
            >
              Mission
            </span>
            <span
              className={`font-extrabold text-white tracking-wider leading-tight ${
                isSm ? 'text-[8px]' : 'text-base'
              }`}
            >
              JEET
            </span>
          </div>
        );

      case 'science-fun':
        return (
          <div className="w-full h-full bg-[#fde047] flex flex-col items-center justify-center">
            <span
              className={`font-black text-[#0f172a] leading-none tracking-tight ${
                isSm ? 'text-[9px]' : 'text-2xl'
              }`}
            >
              S&amp;F
            </span>
            {!isSm && (
              <span className="text-[7px] font-extrabold text-[#0f172a] tracking-widest mt-0.5">
                SCIENCE &amp; FUN
              </span>
            )}
          </div>
        );

      case 'master-sahab':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#e0f2fe] to-[#bae6fd] flex flex-col items-center justify-end relative">
            <div
              className={`${
                isSm ? 'w-3 h-3 mb-0.5' : 'w-8 h-8 mb-1'
              } rounded-full bg-[#334155] flex items-center justify-center`}
            >
              <div
                className={`${
                  isSm ? 'w-2 h-2' : 'w-5 h-5'
                } rounded-full bg-[#fed7aa]`}
              />
            </div>
            <div
              className={`${
                isSm ? 'w-5 h-2' : 'w-12 h-5'
              } rounded-t-full bg-[#0284c7]`}
            />
          </div>
        );

      case 'vibrant':
        return (
          <div className="w-full h-full bg-[#09090b] flex flex-col items-center justify-center">
            <span
              className={`font-serif font-extrabold text-amber-400 leading-none ${
                isSm ? 'text-[10px]' : 'text-2xl'
              }`}
            >
              VV
            </span>
            {!isSm && (
              <span className="text-[7px] font-bold text-amber-200 tracking-widest mt-1">
                VIBRANT
              </span>
            )}
          </div>
        );

      case 'books':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#064e3b] to-[#022c22] flex flex-col items-center justify-center">
            <span
              className={`font-extrabold text-emerald-300 leading-none ${
                isSm ? 'text-[7px]' : 'text-[11px]'
              }`}
            >
              STUDY
            </span>
            <span
              className={`font-extrabold text-white leading-tight ${
                isSm ? 'text-[7px]' : 'text-[12px]'
              }`}
            >
              BOOKS
            </span>
          </div>
        );

      case 'unc':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#042f2e] flex flex-col items-center justify-center">
            <span
              className={`font-black text-emerald-300 leading-none ${
                isSm ? 'text-[9px]' : 'text-lg'
              }`}
            >
              UNC
            </span>
            {!isSm && (
              <span className="text-[7px] font-semibold text-white/80 tracking-wider mt-0.5">
                ACADEMY
              </span>
            )}
          </div>
        );

      case 'rwa':
        return (
          <div className="w-full h-full bg-[#090d16] flex items-center justify-center">
            <div
              className={`${
                isSm ? 'w-5 h-5 border' : 'w-12 h-12 border-2'
              } rounded-full border-red-500 bg-gradient-to-b from-red-600/30 to-blue-900/40 flex items-center justify-center`}
            >
              <span
                className={`font-extrabold text-white leading-none ${
                  isSm ? 'text-[6px]' : 'text-[11px]'
                }`}
              >
                RWA
              </span>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-emerald-950 to-[#060a08] flex items-center justify-center">
            <span
              className={`font-extrabold text-emerald-400 uppercase ${
                isSm ? 'text-[10px]' : 'text-xl'
              }`}
            >
              {(name || id).slice(0, 2)}
            </span>
          </div>
        );
    }
  };

  if (isSm) {
    return (
      <div
        className="w-7 h-7 rounded-lg p-[1.5px] overflow-hidden shrink-0 relative flex items-center justify-center"
        style={{ backgroundColor: `${color}35` }}
      >
        <div className="w-full h-full rounded-[6.5px] overflow-hidden">
          {renderInner()}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-[80px] h-[80px] rounded-[19px] p-[4px] overflow-hidden flex items-center justify-center"
      style={{
        boxShadow: `0 0 24px ${color}40`,
      }}
    >
      {/* Animated rotating colored border beam matching video 00:01 */}
      <div
        className="absolute inset-[-60%] animate-[spin_3.5s_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg, ${color}33 0deg, ${color}33 190deg, ${color} 295deg, #ffffff 345deg, ${color}33 360deg)`,
        }}
        aria-hidden="true"
      />
      {/* Static subtle colored rim */}
      <div
        className="absolute inset-0 rounded-[19px] border pointer-events-none"
        style={{ borderColor: `${color}85` }}
        aria-hidden="true"
      />
      {/* Inner icon container */}
      <div className="relative z-10 w-full h-full rounded-[15px] overflow-hidden bg-[#060a08]">
        {renderInner()}
      </div>
    </div>
  );
}
