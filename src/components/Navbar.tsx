import React, { useState, useRef, useEffect } from 'react';
import { Bookmark, RefreshCw, Flame, Globe, MapPin, ChevronDown, Check } from 'lucide-react';
import { Language, RegionInfo, RegionCode } from '../types';
import { Translations } from '../utils/i18n';
import { SUPPORTED_REGIONS } from '../utils/regions';

interface NavbarProps {
  totalDeals: number;
  onRefresh: () => void;
  isLoading: boolean;
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  currentRegion: RegionInfo;
  onSelectRegion: (regionCode: RegionCode) => void;
  t: Translations;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRefresh,
  isLoading,
  currentLang,
  onSelectLang,
  currentRegion,
  onSelectRegion,
  t,
}) => {
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(event.target as Node)) {
        setIsRegionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#161b22] border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-900/30 text-white font-black text-xl shrink-0">
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2a10 10 0 0 0-9.95 9.07l5.42 2.23a2.98 2.98 0 0 1 1.7-.53c.18 0 .36.02.53.05l2.45-3.56A3.99 3.99 0 0 1 16 6a4 4 0 1 1-3.95 4.54l-3.48 2.4c.02.17.04.34.04.52a2.99 2.99 0 0 1-4.7 2.45L.4 14.47A10 10 0 1 0 12 2zm4 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl text-white tracking-tight">
                {t.appName}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                Live Deals
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Region & Currency Selector */}
          <div className="relative" ref={regionRef}>
            <button
              id="region-selector-btn"
              onClick={() => setIsRegionOpen(!isRegionOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold bg-[#0b0e14] hover:bg-[#1f2937] text-slate-200 border border-slate-700/80 transition-colors cursor-pointer"
              title={`${t.regionSelectorLabel} ${currentRegion.nameEn} (${currentRegion.currency})`}
            >
              <span className="text-sm">{currentRegion.flag}</span>
              <span className="hidden sm:inline font-mono text-cyan-400">{currentRegion.code}</span>
              <span className="text-slate-400 font-mono text-[11px]">({currentRegion.symbol})</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isRegionOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Region Dropdown */}
            {isRegionOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#161b22] border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {t.regionSelectorLabel}
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {Object.values(SUPPORTED_REGIONS).map((reg) => {
                    const isSelected = reg.code === currentRegion.code;
                    return (
                      <button
                        key={reg.code}
                        onClick={() => {
                          onSelectRegion(reg.code);
                          setIsRegionOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/15 text-cyan-300 font-semibold'
                            : 'text-slate-300 hover:bg-[#1f2937]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{reg.flag}</span>
                          <div>
                            <span className="font-medium">
                              {currentLang === 'fi' ? reg.nameFi : reg.nameEn}
                            </span>
                            <span className="ml-1.5 text-[11px] text-slate-400 font-mono">
                              ({reg.currency} {reg.symbol})
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <div className="px-3 py-1.5 bg-[#0b0e14] border-t border-slate-800/80 text-[10px] text-slate-400">
                  {t.regionChangeTip}
                </div>
              </div>
            )}
          </div>

          {/* Bilingual Language Switcher (EN default / FI) */}
          <div className="flex items-center bg-[#0b0e14] rounded-lg p-0.5 border border-slate-700/80 text-xs font-bold">
            <button
              id="lang-btn-en"
              onClick={() => onSelectLang('en')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="English (Default)"
            >
              EN
            </button>
            <button
              id="lang-btn-fi"
              onClick={() => onSelectLang('fi')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                currentLang === 'fi'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Suomi (Finnish)"
            >
              FI
            </button>
          </div>

          {/* Refresh Deals Button */}
          <button
            id="refresh-deals-btn"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-[#1f2937] hover:bg-[#2d3748] text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            title={t.refreshDealsTooltip}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
            <span className="hidden lg:inline">{t.refreshBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
