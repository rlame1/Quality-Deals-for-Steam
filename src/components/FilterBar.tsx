import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Users, 
  X, 
  ArrowUpDown, 
  LayoutList, 
  LayoutGrid, 
  RotateCcw,
  Flame,
  Calendar
} from 'lucide-react';
import { FilterState, SortOption, ViewMode, RegionInfo } from '../types';
import { GENRE_CATEGORIES } from '../data/gameMetadata';
import { Translations } from '../utils/i18n';
import { formatRegionalPrice } from '../utils/regions';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFiltered: number;
  totalAvailable: number;
  t: Translations;
  currentRegion: RegionInfo;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFiltered,
  totalAvailable,
  t,
  currentRegion,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleGenreChange = (genre: string) => {
    onFilterChange({ ...filters, selectedGenre: genre });
  };

  const handleCoopToggle = () => {
    onFilterChange({ ...filters, coopOnly: !filters.coopOnly });
  };

  const handleAllTimeLowToggle = () => {
    onFilterChange({ ...filters, allTimeLowOnly: !filters.allTimeLowOnly });
  };

  const handlePriceChip = (price: number) => {
    onFilterChange({ ...filters, maxPrice: price });
  };

  const handleResetFilters = () => {
    onFilterChange({
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
  };

  const isFiltered = 
    Boolean(filters.search) || 
    filters.maxPrice > 0 || 
    filters.minDiscount > 30 || 
    filters.minMetacritic > 0 || 
    filters.minSteamRating > 0 || 
    filters.minReleaseYear > 0 ||
    (filters.selectedGenre !== 'All' && filters.selectedGenre !== 'Kaikki') || 
    filters.coopOnly || 
    filters.allTimeLowOnly;

  return (
    <div className="bg-[#161b22] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4 mb-6">
      {/* Top row: Search + Sort + View mode */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            id="game-search-input"
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder={t.searchPlaceholder}
            className="w-full bg-[#0b0e14] border border-slate-700 rounded-full py-2 px-4 pl-10 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & View Mode */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-[#0b0e14] border border-slate-700 rounded-md px-3 py-2 text-sm flex-1 sm:flex-initial">
            <ArrowUpDown className="w-4 h-4 text-cyan-500 shrink-0" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 hidden sm:inline">{t.sortLabel}</span>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-slate-300 text-xs sm:text-sm font-medium focus:outline-none cursor-pointer w-full"
            >
              <option value="discount" className="bg-[#0b0e14] text-white">{t.sortDiscount}</option>
              <option value="metacritic" className="bg-[#0b0e14] text-white">{t.sortMetacritic}</option>
              <option value="steamRating" className="bg-[#0b0e14] text-white">{t.sortSteamRating}</option>
              <option value="priceAsc" className="bg-[#0b0e14] text-white">{t.sortPriceAsc}</option>
              <option value="priceDesc" className="bg-[#0b0e14] text-white">{t.sortPriceDesc}</option>
              <option value="dealRating" className="bg-[#0b0e14] text-white">{t.sortDealRating}</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-[#0b0e14] border border-slate-700 rounded-lg p-1 shrink-0">
            <button
              id="view-list-btn"
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="List view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              id="view-grid-btn"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Advanced filters toggle button */}
          <button
            id="toggle-advanced-filters-btn"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              showAdvanced || isFiltered
                ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300'
                : 'bg-[#0b0e14] border-slate-700 text-slate-300 hover:bg-[#1c222d]'
            }`}
            title={t.filtersBtn}
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-500" />
            <span className="hidden sm:inline">{t.filtersBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Filter Pills: Genres + Co-op toggle + All-Time Low + Price chips */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        {/* Genre horizontal scrollable chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider shrink-0 pl-1">
            {t.genreLabel}
          </span>
          {['All', ...GENRE_CATEGORIES.filter(g => g !== 'Kaikki')].map((genre) => {
            const isSelected = filters.selectedGenre === genre || (genre === 'All' && filters.selectedGenre === 'Kaikki');
            const displayLabel = t.genres[genre] || genre;
            return (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-600 text-white font-bold shadow-sm'
                    : 'bg-[#0b0e14] text-slate-300 hover:bg-[#1c222d] border border-slate-700'
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>

        {/* Quick toggles row: Online Co-op + All-Time Low + Quick Price limits */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* All-Time Low Filter Pill */}
            <button
              id="filter-all-time-low-btn"
              onClick={handleAllTimeLowToggle}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                filters.allTimeLowOnly
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-400 shadow-sm shadow-emerald-950/40'
                  : 'bg-[#0b0e14] text-slate-300 border-slate-700 hover:bg-[#1c222d]'
              }`}
              title={t.allTimeLowTooltip}
            >
              <Flame className={`w-3.5 h-3.5 ${filters.allTimeLowOnly ? 'text-emerald-400 fill-emerald-400' : 'text-emerald-500'}`} />
              <span>{t.allTimeLowFilter}</span>
              {filters.allTimeLowOnly && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            {/* Online Co-op Filter Pill */}
            <button
              id="filter-coop-btn"
              onClick={handleCoopToggle}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                filters.coopOnly
                  ? 'bg-cyan-950/50 text-cyan-300 border-cyan-500 shadow-sm shadow-cyan-950/40'
                  : 'bg-[#0b0e14] text-slate-300 border-slate-700 hover:bg-[#1c222d]'
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${filters.coopOnly ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{t.coopFilter}</span>
              {filters.coopOnly && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>

            {/* Release Year Quick Filter */}
            <div className="flex items-center gap-1.5 bg-[#0b0e14] border border-slate-700 rounded-md px-2.5 py-1 text-xs">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider hidden md:inline">
                {t.releaseYearLabel}
              </span>
              <select
                id="release-year-select"
                value={filters.minReleaseYear}
                onChange={(e) => onFilterChange({ ...filters, minReleaseYear: Number(e.target.value) })}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
                title={t.releaseYearTooltip}
              >
                <option value={0} className="bg-[#0b0e14] text-white">{t.allYearsOption}</option>
                <option value={2024} className="bg-[#0b0e14] text-white">2024+ ({t.newestGames})</option>
                <option value={2022} className="bg-[#0b0e14] text-white">2022+</option>
                <option value={2020} className="bg-[#0b0e14] text-white">2020+</option>
                <option value={2018} className="bg-[#0b0e14] text-white">2018+</option>
                <option value={2015} className="bg-[#0b0e14] text-white">2015+</option>
                <option value={2010} className="bg-[#0b0e14] text-white">2010+</option>
              </select>
            </div>

            {/* Quick Price Buttons */}
            <div className="hidden sm:flex items-center gap-1 bg-[#0b0e14] border border-slate-700 rounded-md p-1 text-xs">
              <span className="text-slate-500 px-2 text-[11px] font-bold uppercase tracking-wider">{t.priceFilterLabel}</span>
              {[
                { label: t.priceAll, value: 0 },
                { label: `< ${formatRegionalPrice(5, currentRegion)}`, value: 5 },
                { label: `< ${formatRegionalPrice(10, currentRegion)}`, value: 10 },
                { label: `< ${formatRegionalPrice(15, currentRegion)}`, value: 15 },
                { label: `< ${formatRegionalPrice(20, currentRegion)}`, value: 20 },
              ].map((chip) => (
                <button
                  key={chip.value}
                  onClick={() => handlePriceChip(chip.value)}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    filters.maxPrice === chip.value
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-[#1c222d]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Status Count & Reset */}
          <div className="flex items-center gap-3 text-xs text-slate-400 ml-auto">
            <span>
              {totalFiltered} / {totalAvailable} {t.footerGamesCount.replace('{count}', '')}
            </span>
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.resetBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced sliders drawer */}
      {showAdvanced && (
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-[#0b0e14] p-4 rounded-lg">
          {/* Max price slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="text-slate-400 font-medium">{t.maxPriceLabel}</label>
              <span className="font-bold text-cyan-400 font-mono">
                {filters.maxPrice === 0 ? t.noLimit : formatRegionalPrice(filters.maxPrice, currentRegion)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="2.5"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Min discount slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="text-slate-400 font-medium">{t.minDiscountLabel}</label>
              <span className="font-bold text-emerald-400 font-mono">
                {`≥ ${Math.max(30, filters.minDiscount)}%`}
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              step="5"
              value={Math.max(30, filters.minDiscount)}
              onChange={(e) => onFilterChange({ ...filters, minDiscount: parseInt(e.target.value, 10) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Min Release Year slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="text-slate-400 font-medium">{t.minReleaseYearLabel}</label>
              <span className="font-bold text-cyan-400 font-mono">
                {filters.minReleaseYear === 0 ? t.allYearsOption : `≥ ${filters.minReleaseYear}`}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="2026"
              step="1"
              value={filters.minReleaseYear === 0 ? 2000 : filters.minReleaseYear}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onFilterChange({ ...filters, minReleaseYear: val <= 2000 ? 0 : val });
              }}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Min Metascore slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="text-slate-400 font-medium">{t.minMetacriticLabel}</label>
              <span className="font-bold text-amber-400 font-mono">
                {filters.minMetacritic === 0 ? t.noLimit : `≥ ${filters.minMetacritic}`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={filters.minMetacritic}
              onChange={(e) => onFilterChange({ ...filters, minMetacritic: parseInt(e.target.value, 10) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Min Steam User Rating slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="text-slate-400 font-medium">{t.minSteamRatingLabel}</label>
              <span className="font-bold text-cyan-400 font-mono">
                {filters.minSteamRating === 0 ? t.noLimit : `≥ ${filters.minSteamRating}%`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={filters.minSteamRating}
              onChange={(e) => onFilterChange({ ...filters, minSteamRating: parseInt(e.target.value, 10) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
