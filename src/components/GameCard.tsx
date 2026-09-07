import React from 'react';
import { ExternalLink, Bookmark, Users, ThumbsUp, Flame, TrendingDown } from 'lucide-react';
import { GameDeal, RegionInfo, STEAM_FALLBACK_IMAGE } from '../types';
import { Translations } from '../utils/i18n';
import { formatRegionalPrice } from '../utils/regions';

interface GameCardProps {
  deal: GameDeal;
  onSelectGame: (deal: GameDeal) => void;
  t: Translations;
  currentRegion: RegionInfo;
}

export const GameCard: React.FC<GameCardProps> = ({
  deal,
  onSelectGame,
  t,
  currentRegion,
}) => {
  return (
    <div
      id={`game-card-${deal.id}`}
      className="group bg-[#161b22] hover:bg-[#1c222d] border border-slate-800 hover:border-cyan-500/50 rounded-xl overflow-hidden transition-all duration-200 flex flex-col shadow-sm hover:shadow-md cursor-pointer"
      onClick={() => onSelectGame(deal)}
    >
      {/* Banner Image with overlay badges */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0b0e14]">
        <img
          src={deal.banner || deal.thumb || STEAM_FALLBACK_IMAGE}
          alt={deal.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            if (deal.thumb && target.src !== deal.thumb) {
              target.src = deal.thumb;
            } else {
              target.src = STEAM_FALLBACK_IMAGE;
            }
          }}
        />

        {/* Top Badges: Discount + Historical Low */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <div className="px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 font-bold border border-emerald-400/30 text-xs backdrop-blur-sm">
            -{deal.discountPercent}%
          </div>
          {deal.isHistoricalLow && (
            <div className="px-2 py-0.5 rounded bg-emerald-500/90 text-white font-extrabold text-[10px] shadow-sm flex items-center gap-1 tracking-tight">
              <Flame className="w-3 h-3 fill-current" />
              <span>{t.historicalLowBadge}</span>
            </div>
          )}
        </div>

        {/* Co-op Tag bottom-left if applicable */}
        {deal.isCoop && (
          <div className="absolute bottom-2.5 left-2.5 bg-cyan-950/90 backdrop-blur-sm text-cyan-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 border border-cyan-500/30">
            <Users className="w-3 h-3 text-cyan-400" />
            <span>{t.coopBadge}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title & Release Year */}
          <div className="flex items-baseline justify-between gap-1.5">
            <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-cyan-300 transition-colors line-clamp-1">
              {deal.title}
            </h3>
            {deal.releaseYear && (
              <span className="text-[11px] font-mono text-slate-500 shrink-0">
                ({deal.releaseYear})
              </span>
            )}
          </div>

          {/* Genres */}
          <div className="text-xs text-slate-500 italic uppercase tracking-tighter truncate mt-1">
            {deal.genres.map(g => t.genres[g] || g).slice(0, 3).join(', ')}
          </div>
        </div>

        {/* Scores Row: Metacritic + Steam Reviews */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
          {/* Metascore */}
          {deal.metacriticScore > 0 ? (
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-block w-6 h-6 leading-6 text-center font-bold rounded text-xs ${
                  deal.metacriticScore >= 75
                    ? 'bg-[#66cc33] text-black'
                    : deal.metacriticScore >= 50
                    ? 'bg-[#ffcc33] text-black'
                    : 'bg-[#ff3333] text-white'
                }`}
                title={`Metascore: ${deal.metacriticScore}/100`}
              >
                {deal.metacriticScore}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Meta</span>
            </div>
          ) : (
            <div className="text-[11px] text-slate-600 italic">-</div>
          )}

          {/* Steam User Score */}
          {deal.steamRatingPercent > 0 && (
            <div
              className="flex items-center gap-1 text-slate-300"
              title={`Steam: ${deal.steamRatingPercent}% (${t.steamRatings[deal.steamRatingText] || deal.steamRatingText})`}
            >
              <ThumbsUp className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400 font-semibold text-xs">
                {(deal.steamRatingPercent / 10).toFixed(1)}
              </span>
              <span className="text-slate-500 text-[10px]">({deal.steamRatingPercent}%)</span>
            </div>
          )}
        </div>

        {/* Pricing, Historical Low Comparison & Footer Actions */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-slate-500 line-through">
                {formatRegionalPrice(deal.normalPrice, currentRegion)}
              </span>
              <span className="text-base font-bold text-white">
                {formatRegionalPrice(deal.salePrice, currentRegion)}
              </span>
            </div>

            {/* Historical Low Comparison */}
            <div className="text-[10px] mt-0.5">
              {deal.isHistoricalLow ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3" />
                  {t.allTimeLowComparison}
                </span>
              ) : (
                <span className="text-slate-400">
                  {t.historicalLowDiff}: <span className="font-mono text-amber-400">+{formatRegionalPrice(deal.diffFromHistoricalLow, currentRegion)}</span>
                </span>
              )}
            </div>
          </div>

          <a
            id={`steam-card-link-${deal.id}`}
            href={deal.steamUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-md bg-[#1f2937] hover:bg-cyan-600 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title={t.openSteamStore}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
