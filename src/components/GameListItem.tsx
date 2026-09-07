import React from 'react';
import { ExternalLink, Bookmark, Users, Flame, TrendingDown } from 'lucide-react';
import { GameDeal, RegionInfo, STEAM_FALLBACK_IMAGE } from '../types';
import { Translations } from '../utils/i18n';
import { formatRegionalPrice } from '../utils/regions';

interface GameListItemProps {
  deal: GameDeal;
  index: number;
  onSelectGame: (deal: GameDeal) => void;
  t: Translations;
  currentRegion: RegionInfo;
}

export const GameListItem: React.FC<GameListItemProps> = ({
  deal,
  index,
  onSelectGame,
  t,
  currentRegion,
}) => {
  // Metascore badge
  const getMetascoreBadge = (score: number) => {
    if (!score || score <= 0) return null;
    let colorClass = 'bg-[#66cc33] text-black';
    if (score < 75 && score >= 50) {
      colorClass = 'bg-[#ffcc33] text-black';
    } else if (score < 50) {
      colorClass = 'bg-[#ff3333] text-white';
    }

    return (
      <span
        className={`inline-block w-7 h-7 leading-7 text-center font-bold rounded text-xs shrink-0 ${colorClass}`}
        title={`Metascore: ${score}/100`}
      >
        {score}
      </span>
    );
  };

  // Steam user rating
  const getSteamRatingBadge = (percent: number, text: string, count: number) => {
    if (!percent || percent <= 0) return null;
    const translatedText = t.steamRatings[text] || text;
    return (
      <div
        className="flex items-center gap-1 text-xs text-slate-300"
        title={`Steam: ${percent}% (${count ? count.toLocaleString() : ''}) - ${translatedText}`}
      >
        <span className="text-cyan-400 font-semibold text-sm">
          {(percent / 10).toFixed(1)}
        </span>
        <span className="text-slate-500 text-[11px] hidden xl:inline truncate max-w-[120px]">
          ({percent}%)
        </span>
      </div>
    );
  };

  return (
    <div
      id={`game-item-${deal.id}`}
      className={`group px-4 sm:px-6 py-3.5 border-b border-slate-800/50 hover:bg-[#1c222d] transition-colors duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        deal.isCoop ? 'bg-cyan-950/10' : 'bg-[#161b22]'
      }`}
    >
      {/* Left: Index + Thumb + Titles & Badges */}
      <div 
        className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 cursor-pointer"
        onClick={() => onSelectGame(deal)}
      >
        {/* Rank / Index number */}
        <span className="text-xs font-mono font-semibold text-slate-500 w-5 text-center shrink-0">
          #{index + 1}
        </span>

        {/* Thumbnail Image */}
        <div className="relative w-16 sm:w-20 h-9 sm:h-10 rounded overflow-hidden shrink-0 bg-slate-900 border border-slate-700/60 group-hover:border-cyan-400/50 transition-colors">
          <img
            src={deal.thumb || deal.banner || STEAM_FALLBACK_IMAGE}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              if (deal.banner && target.src !== deal.banner) {
                target.src = deal.banner;
              } else {
                target.src = STEAM_FALLBACK_IMAGE;
              }
            }}
          />
        </div>

        {/* Game Title, Badges & Genres */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            {deal.isHistoricalLow && (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 tracking-tight">
                <Flame className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                {t.historicalLowBadge}
              </span>
            )}
            {deal.isCoop && (
              <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                <Users className="w-3 h-3" />
                {t.coopBadge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-cyan-300 transition-colors truncate">
              {deal.title}
            </h3>
            {deal.releaseYear && (
              <span className="text-[11px] text-slate-500 font-normal">
                ({deal.releaseYear})
              </span>
            )}
          </div>

          {/* Genres */}
          <div className="text-xs text-slate-500 italic uppercase tracking-tighter truncate mt-0.5">
            {deal.genres.map(g => t.genres[g] || g).slice(0, 3).join(', ')}
          </div>
        </div>
      </div>

      {/* Middle/Right: Scores, Discount, Price, Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/60">
        {/* Metascore & Steam score */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase sm:hidden">Meta</span>
            {deal.metacriticScore > 0 ? (
              getMetascoreBadge(deal.metacriticScore)
            ) : (
              <span className="text-[11px] text-slate-600 font-mono">-</span>
            )}
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase sm:hidden">Steam</span>
            {getSteamRatingBadge(deal.steamRatingPercent, deal.steamRatingText, deal.steamRatingCount)}
          </div>
        </div>

        {/* Discount Tag */}
        <div className="shrink-0 text-center">
          <span className="text-emerald-400 font-bold bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded text-xs inline-block">
            -{deal.discountPercent}%
          </span>
        </div>

        {/* Price amounts & Historical Low Comparison */}
        <div className="text-right min-w-[85px] shrink-0">
          <div className="text-slate-500 line-through text-[11px]">
            {formatRegionalPrice(deal.normalPrice, currentRegion)}
          </div>
          <div className="text-white font-bold text-sm sm:text-base leading-tight">
            {formatRegionalPrice(deal.salePrice, currentRegion)}
          </div>

          {/* Comparison to Lowest Recorded Price */}
          <div className="text-[10px] tracking-tight mt-0.5">
            {deal.isHistoricalLow ? (
              <span className="text-emerald-400 font-semibold flex items-center justify-end gap-0.5">
                <TrendingDown className="w-3 h-3" />
                {t.allTimeLowComparison}
              </span>
            ) : (
              <span className="text-slate-400" title={`${t.recordedHistoricalLow}: ${formatRegionalPrice(deal.historicalLow, currentRegion)}`}>
                {t.historicalLowDiff}: <span className="font-mono text-amber-400">+{formatRegionalPrice(deal.diffFromHistoricalLow, currentRegion)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action buttons: Steam store */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Open in Steam Store */}
          <a
            id={`steam-link-${deal.id}`}
            href={deal.steamUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#1f2937] hover:bg-cyan-600 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
            title={t.openSteamStore}
          >
            <span>Steam</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
