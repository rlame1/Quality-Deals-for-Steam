import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { GameListItem } from './components/GameListItem';
import { GameCard } from './components/GameCard';
import { GameDetailModal } from './components/GameDetailModal';
import { Pagination } from './components/Pagination';
import { GameDeal, FilterState, SortOption, ViewMode, Language, RegionInfo, RegionCode } from './types';
import { FALLBACK_DEALS } from './data/fallbackDeals';
import { fetchLiveDealsFromCheapShark } from './utils/cheapSharkLive';
import { TRANSLATIONS } from './utils/i18n';
import { detectUserRegion, SUPPORTED_REGIONS, formatRegionalPrice } from './utils/regions';
import { Sparkles, Filter, MapPin, Flame, Globe, RefreshCw } from 'lucide-react';

const LANG_STORAGE_KEY = 'steam_deal_finder_lang_v2';
const REGION_STORAGE_KEY = 'steam_deal_finder_region_v2';

export default function App() {
  // Language state: English default, Finnish supported
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'fi' || saved === 'en') return saved;
    } catch {}
    return 'en'; // Default is English as requested
  });

  // Region state: auto-detect user's actual region
  const [region, setRegion] = useState<RegionInfo>(() => detectUserRegion());

  const t = TRANSLATIONS[lang];

  const [deals, setDeals] = useState<GameDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state - default minDiscount 30% per user request
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    maxPrice: 0,
    minDiscount: 30,
    minMetacritic: 0,
    minSteamRating: 0,
    minReleaseYear: 0,
    selectedGenre: 'All',
    coopOnly: false,
    allTimeLowOnly: false,
  });

  // Pagination state - default 20 results per page as requested
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // Sorting state - DEFAULT is discount percentage
  const [sortBy, setSortBy] = useState<SortOption>('discount');

  // View mode - default is 'list' as requested
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Selected game for modal
  const [selectedGame, setSelectedGame] = useState<GameDeal | null>(null);

  // Save language and region to localStorage
  const handleSelectLang = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {}
  };

  const handleSelectRegion = (code: RegionCode) => {
    const reg = SUPPORTED_REGIONS[code] || SUPPORTED_REGIONS.US;
    setRegion(reg);
    try {
      localStorage.setItem(REGION_STORAGE_KEY, code);
    } catch {}
  };

  // Load deals from backend API, bundled static JSON (GitHub Pages), or live multi-page CheapShark API
  const loadDeals = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    // 1. If running full-stack, try /api/deals first
    if (!forceRefresh) {
      try {
        const queryParams = new URLSearchParams({
          region: region.code,
          lang,
        });
        const res = await fetch(`/api/deals?${queryParams.toString()}`);
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && !contentType.includes("text/html")) {
            const data = await res.json();
            if (data.deals && Array.isArray(data.deals) && data.deals.length > 50) {
              setDeals(data.deals);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch {
        // Backend not available (e.g. GitHub Pages static host), proceed to static dataset
      }
    }

    // 2. Static host (GitHub Pages): Load pre-compiled deals.json (instant load of 1,700+ deals)
    if (!forceRefresh) {
      try {
        const baseUrl = ((import.meta as any).env?.BASE_URL as string) || '/';
        const dealsUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}deals.json`;
        const jsonRes = await fetch(dealsUrl);
        if (jsonRes.ok) {
          const staticData = await jsonRes.json();
          if (Array.isArray(staticData) && staticData.length > 50) {
            setDeals(staticData);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not load bundled deals.json:', err);
      }
    }

    // 3. If forceRefresh requested or deals.json unavailable: fetch live multi-page from CheapShark
    try {
      console.log('Fetching live multi-page deals from CheapShark API...');
      const liveDeals = await fetchLiveDealsFromCheapShark(25);
      if (liveDeals && liveDeals.length > 0) {
        setDeals(liveDeals);
        setIsLoading(false);
        return;
      }
    } catch (csErr) {
      console.warn('CheapShark multi-page fetch error:', csErr);
    }

    // 4. Ultimate fallback to curated deals if network is offline
    if (FALLBACK_DEALS && FALLBACK_DEALS.length > 0) {
      setDeals(FALLBACK_DEALS);
    } else {
      setError(t.apiErrorDesc);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadDeals();
  }, [region.code, lang]);

  // Filter and sort deals
  const filteredAndSortedDeals = useMemo(() => {
    let result = [...deals];

    // Search
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.genres.some((genre) => genre.toLowerCase().includes(query))
      );
    }

    // Genre
    if (filters.selectedGenre && filters.selectedGenre !== 'All' && filters.selectedGenre !== 'Kaikki') {
      const targetGenre = filters.selectedGenre.toLowerCase();
      result = result.filter((g) =>
        g.genres.some((genre) => {
          const gLower = genre.toLowerCase();
          if (gLower === targetGenre) return true;
          const enTrans = (TRANSLATIONS.en.genres[genre] || '').toLowerCase();
          const fiTrans = (TRANSLATIONS.fi.genres[genre] || '').toLowerCase();
          return enTrans === targetGenre || fiTrans === targetGenre;
        })
      );
    }

    // Online Co-op
    if (filters.coopOnly) {
      result = result.filter((g) => g.isCoop);
    }

    // All-time lowest price only
    if (filters.allTimeLowOnly) {
      result = result.filter((g) => g.isHistoricalLow);
    }

    // Max Price
    if (filters.maxPrice > 0) {
      result = result.filter((g) => g.salePrice <= filters.maxPrice);
    }

    // Min Discount
    if (filters.minDiscount > 0) {
      result = result.filter((g) => g.discountPercent >= filters.minDiscount);
    }

    // Min Metacritic
    if (filters.minMetacritic > 0) {
      result = result.filter((g) => g.metacriticScore >= filters.minMetacritic);
    }

    // Min Steam Rating
    if (filters.minSteamRating > 0) {
      result = result.filter((g) => g.steamRatingPercent >= filters.minSteamRating);
    }

    // Min Release Year (prune older games)
    if (filters.minReleaseYear > 0) {
      result = result.filter(
        (g) => g.releaseYear !== undefined && g.releaseYear >= filters.minReleaseYear
      );
    }

    // Best deals only
    if (filters.bestDealsOnly) {
      result = result.filter(
        (g) =>
          (g.metacriticScore >= 75 || g.metacriticScore === 0) &&
          g.steamRatingPercent >= 80 &&
          g.discountPercent >= 50
      );
    }

    // Sort: default is discount percentage descending!
    result.sort((a, b) => {
      if (sortBy === 'discount') {
        if (b.discountPercent !== a.discountPercent) return b.discountPercent - a.discountPercent;
        return b.steamRatingPercent - a.steamRatingPercent;
      }
      if (sortBy === 'metacritic') {
        if (b.metacriticScore !== a.metacriticScore) return b.metacriticScore - a.metacriticScore;
        return b.steamRatingPercent - a.steamRatingPercent;
      }
      if (sortBy === 'steamRating') {
        if (b.steamRatingPercent !== a.steamRatingPercent) return b.steamRatingPercent - a.steamRatingPercent;
        return b.discountPercent - a.discountPercent;
      }
      if (sortBy === 'priceAsc') {
        return a.salePrice - b.salePrice;
      }
      if (sortBy === 'priceDesc') {
        return b.salePrice - a.salePrice;
      }
      if (sortBy === 'dealRating') {
        return (b.dealRating || 0) - (a.dealRating || 0);
      }
      return b.discountPercent - a.discountPercent;
    });

    return result;
  }, [deals, filters, sortBy]);

  // Count how many deals are currently at all-time low
  const allTimeLowCount = useMemo(() => {
    return deals.filter(d => d.isHistoricalLow).length;
  }, [deals]);

  // Reset pagination to page 1 whenever filters or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  // Pagination calculations
  const totalFiltered = filteredAndSortedDeals.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalFiltered);
  const paginatedDeals = useMemo(() => {
    return filteredAndSortedDeals.slice(startIndex, endIndex);
  }, [filteredAndSortedDeals, startIndex, endIndex]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 flex flex-col antialiased">
      {/* Navbar */}
      <Navbar
        totalDeals={deals.length}
        onRefresh={() => loadDeals(true)}
        isLoading={isLoading}
        currentLang={lang}
        onSelectLang={handleSelectLang}
        currentRegion={region}
        onSelectRegion={handleSelectRegion}
        t={t}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner with detected region and all-time low highlight */}
        <div className="mb-6 p-4 rounded-xl bg-[#161b22] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              {t.appTagline}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.bannerDesc}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Region badge */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-[#0b0e14] px-3 py-1.5 rounded-lg border border-slate-700/80">
              <span className="text-base">{region.flag}</span>
              <span className="text-cyan-400 font-mono">{region.code}</span>
              <span className="text-slate-400">({region.currency} {region.symbol})</span>
            </div>

            {/* All-time low count badge */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
              <Flame className="w-3.5 h-3.5 fill-emerald-400" />
              <span>{allTimeLowCount} {t.allTimeLowCountBadge}</span>
            </div>

            {/* Total deals count */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-[#0b0e14] px-3 py-1.5 rounded-lg border border-slate-700/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.dealsInCatalog.replace('{count}', deals.length.toString())}</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFiltered={filteredAndSortedDeals.length}
          totalAvailable={deals.length}
          t={t}
          currentRegion={region}
        />

        {/* Error / API Connection State */}
        {error ? (
          <div className="py-16 text-center bg-rose-950/20 border border-rose-500/30 rounded-xl p-8 space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
              <Globe className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{t.apiErrorTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                {error}
              </p>
            </div>
            <button
              onClick={() => loadDeals(true)}
              className="px-6 py-2.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.refreshPage}</span>
            </button>
          </div>
        ) : isLoading && deals.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-600/30 border-t-cyan-500 animate-spin" />
            <div>
              <h3 className="font-bold text-white text-base">{t.loadingDeals}</h3>
              <p className="text-xs text-slate-400 mt-1">{t.loadingDealsSubtitle}</p>
            </div>
          </div>
        ) : filteredAndSortedDeals.length === 0 ? (
          /* Empty Search / Filter Results State */
          <div className="py-16 text-center bg-[#161b22] border border-slate-800 rounded-xl p-8 space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-xl bg-[#0b0e14] border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
              <Filter className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{t.noDealsFound}</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                {t.noDealsSuggestion}
              </p>
            </div>
            <button
              onClick={() =>
                setFilters({
                  search: '',
                  maxPrice: 0,
                  minDiscount: 0,
                  minMetacritic: 0,
                  minSteamRating: 0,
                  minReleaseYear: 0,
                  selectedGenre: 'All',
                  coopOnly: false,
                  allTimeLowOnly: false,
                })
              }
              className="px-5 py-2.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
            >
              {t.resetAllFilters}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {viewMode === 'list' ? (
              /* Elegant List View */
              <div className="bg-[#161b22] rounded-xl border border-slate-800 overflow-hidden shadow-sm flex flex-col">
                {/* Table Header Row */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-2.5 bg-[#1f2937] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <div className="col-span-6 sm:col-span-5">{t.tableHeaderTitle}</div>
                  <div className="col-span-2 text-center">{t.tableHeaderRatings}</div>
                  <div className="col-span-1 text-center">{t.tableHeaderDiscount}</div>
                  <div className="col-span-2 text-right">{t.tableHeaderPrice}</div>
                  <div className="col-span-2 text-right">{t.tableHeaderAction}</div>
                </div>

                {/* List items */}
                <div className="divide-y divide-slate-800/40">
                  {paginatedDeals.map((deal, index) => (
                    <GameListItem
                      key={deal.id}
                      deal={deal}
                      index={startIndex + index}
                      onSelectGame={setSelectedGame}
                      t={t}
                      currentRegion={region}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {paginatedDeals.map((deal) => (
                  <GameCard
                    key={deal.id}
                    deal={deal}
                    onSelectGame={setSelectedGame}
                    t={t}
                    currentRegion={region}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <Pagination
              currentPage={validCurrentPage}
              totalPages={totalPages}
              totalItems={totalFiltered}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              t={t}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-[#161b22] py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="font-semibold text-slate-400">Quality Deals for Steam</span>
            <span>•</span>
            <span>{t.footerSyncInfo}</span>
            <span>•</span>
            <span>{t.footerGamesCount.replace('{count}', deals.length.toString())}</span>
            <span>•</span>
            <span className="text-cyan-400 font-mono">{region.flag} {region.nameEn} ({region.currency})</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Steam API Online
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Metacritic Sync
            </span>
            <a
              href="https://store.steampowered.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Steam
            </a>
          </div>
        </div>
      </footer>

      {/* Detailed Game Modal */}
      <GameDetailModal
        deal={selectedGame}
        onClose={() => setSelectedGame(null)}
        t={t}
        currentRegion={region}
        currentLang={lang}
      />
    </div>
  );
}
