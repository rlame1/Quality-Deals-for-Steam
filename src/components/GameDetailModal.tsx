import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Bookmark, Users, Award, ThumbsUp, Calendar, Flame, TrendingDown, Clock, Info } from 'lucide-react';
import { GameDeal, RegionInfo } from '../types';
import { Translations } from '../utils/i18n';
import { formatRegionalPrice } from '../utils/regions';

interface GameDetailModalProps {
  deal: GameDeal | null;
  onClose: () => void;
  t: Translations;
  currentRegion: RegionInfo;
  currentLang?: string;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  deal,
  onClose,
  t,
  currentRegion,
  currentLang = 'fi',
}) => {
  const [extraDetails, setExtraDetails] = useState<any>(null);

  useEffect(() => {
    if (!deal) return;

    let isCancelled = false;

    fetch(`/api/game/${deal.id}?region=${currentRegion.code}&lang=${currentLang}`)
      .then((r) => r.json())
      .then((data) => {
        if (!isCancelled) {
          setExtraDetails(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load extra game details:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, [deal?.id, currentRegion.code]);

  if (!deal) return null;

  const savings = formatRegionalPrice(Math.max(0, deal.normalPrice - deal.salePrice), currentRegion);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#161b22] border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image with close button */}
        <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full bg-[#0b0e14] overflow-hidden">
          <img
            src={extraDetails?.headerImage || deal.banner}
            alt={deal.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = deal.thumb;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-black/40" />

          {/* Close button */}
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-lg bg-[#0b0e14]/80 hover:bg-[#0b0e14] border border-slate-700 text-white backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Discount & Badges on banner */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-md bg-emerald-400/15 border border-emerald-400/30 text-emerald-400 font-black text-base shadow-lg backdrop-blur-md">
              -{deal.discountPercent}%
            </span>
            {deal.isHistoricalLow && (
              <span className="px-3 py-1 rounded-md bg-emerald-500 text-white font-extrabold text-xs shadow-lg backdrop-blur-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {t.historicalLowBadge}
              </span>
            )}
            {deal.isCoop && (
              <span className="px-2.5 py-1 rounded-md bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase flex items-center gap-1.5 backdrop-blur-md">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                {t.coopBadge}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Title and Release Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {deal.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                {deal.releaseYear && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                    {deal.releaseYear}
                  </span>
                )}
                <span>Steam App ID: {deal.id}</span>
                <span className="text-cyan-400 font-mono">
                  {currentRegion.flag} {currentRegion.nameEn} ({currentRegion.currency})
                </span>
              </div>
            </div>

          </div>

          {/* Historical Low Price Analysis Section */}
          <div className={`p-4 rounded-xl border ${
            deal.isHistoricalLow
              ? 'bg-emerald-950/25 border-emerald-500/40'
              : 'bg-[#0b0e14] border-slate-800'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Flame className={`w-4 h-4 ${deal.isHistoricalLow ? 'text-emerald-400' : 'text-amber-400'}`} />
                  {t.historicalLowTitle}
                </div>
                <p className="text-xs text-slate-300">
                  {deal.isHistoricalLow
                    ? t.historicalLowDesc
                    : t.notHistoricalLowDesc.replace('{diff}', formatRegionalPrice(deal.diffFromHistoricalLow, currentRegion))}
                </p>
              </div>

              {/* Price comparison badge */}
              <div className="text-right shrink-0">
                <div className="text-[11px] text-slate-400">{t.recordedHistoricalLow}:</div>
                <div className="text-base font-bold font-mono text-emerald-400">
                  {formatRegionalPrice(deal.historicalLow, currentRegion)}
                </div>
                {deal.historicalLowDate && (
                  <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {deal.historicalLowDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ratings grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Metascore Card */}
            <div className="p-3.5 rounded-lg bg-[#0b0e14] border border-slate-800 flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-md flex items-center justify-center font-bold text-base shrink-0 ${
                  deal.metacriticScore >= 75
                    ? 'bg-[#66cc33] text-black'
                    : deal.metacriticScore >= 50
                    ? 'bg-[#ffcc33] text-black'
                    : 'bg-[#ff3333] text-white'
                }`}
              >
                {deal.metacriticScore > 0 ? deal.metacriticScore : '-'}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  Metascore
                </div>
                <div className="text-[11px] text-slate-400">
                  {deal.metacriticScore >= 75
                    ? 'Universal Acclaim'
                    : deal.metacriticScore > 0
                    ? 'Generally Favorable'
                    : t.noReviews}
                </div>
              </div>
            </div>

            {/* Steam User Reviews Card */}
            <div className="p-3.5 rounded-lg bg-[#0b0e14] border border-slate-800 flex items-center gap-3">
              <div className="w-11 h-11 rounded-md bg-cyan-950/40 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                {deal.steamRatingPercent > 0 ? `${deal.steamRatingPercent}%` : '-'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                  {t.steamRatingLabel}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {t.steamRatings[deal.steamRatingText] || deal.steamRatingText}
                  {deal.steamRatingCount > 0 && ` (${deal.steamRatingCount.toLocaleString()})`}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.aboutGame}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {extraDetails?.shortDescription || deal.shortDescription || t.aboutGameFallback}
            </p>
          </div>

          {/* Genres & Tags */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {t.genresAndFeatures}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(extraDetails?.genres || deal.genres).map((g: string) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-md bg-[#0b0e14] text-slate-300 border border-slate-700/80 text-xs font-medium"
                >
                  {t.genres[g] || g}
                </span>
              ))}
              {deal.isCoop && (
                <span className="px-2.5 py-1 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1">
                  <Users className="w-3 h-3 text-cyan-400" />
                  {t.coopFilter}
                </span>
              )}
            </div>
          </div>

          {/* Price & Steam Purchase CTA */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0b0e14] p-4 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs text-slate-400">
                {t.regularPrice}: <span className="line-through">{formatRegionalPrice(deal.normalPrice, currentRegion)}</span> ({t.youSave} {savings})
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-white">
                  {formatRegionalPrice(deal.salePrice, currentRegion)}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  -{deal.discountPercent}%
                </span>
              </div>
            </div>

            <a
              id="modal-steam-button"
              href={deal.steamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>{t.openSteamStore}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
