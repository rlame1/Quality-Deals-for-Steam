export type Language = 'en' | 'fi';

export type RegionCode = 'FI' | 'EU' | 'US' | 'GB' | 'CA' | 'AU' | 'SE' | 'NO';

export interface RegionInfo {
  code: RegionCode;
  nameEn: string;
  nameFi: string;
  currency: string;
  symbol: string;
  symbolPosition: 'prefix' | 'suffix';
  multiplier: number; // Price multiplier relative to USD baseline
  flag: string;
}

export interface GameDeal {
  id: string; // steamAppID
  dealId?: string;
  gameId?: string;
  title: string;
  salePrice: number;
  normalPrice: number;
  discountPercent: number;
  metacriticScore: number;
  steamRatingPercent: number;
  steamRatingText: string;
  steamRatingCount: number;
  thumb: string;
  banner: string;
  steamUrl: string;
  genres: string[];
  isCoop: boolean;
  isMultiplayer: boolean;
  shortDescription?: string;
  releaseYear?: number;
  dealRating?: number;

  // Historical low (All-time low / halvin ikinä)
  historicalLow: number;
  isHistoricalLow: boolean;
  historicalLowDate?: string;
  diffFromHistoricalLow: number;
}

export const STEAM_FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='460' height='215' viewBox='0 0 460 215'%3E%3Crect width='460' height='215' fill='%23111827'/%3E%3Cpath d='M230 75a18 18 0 100 36 18 18 0 000-36zm-30 50h60v6h-60z' fill='%23374151'/%3E%3Ctext x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='sans-serif' font-size='13' font-weight='600'%3ESteam Game%3C/text%3E%3C/svg%3E";

export type SortOption = 'discount' | 'metacritic' | 'steamRating' | 'priceAsc' | 'priceDesc' | 'dealRating';

export type ViewMode = 'list' | 'grid';

export interface FilterState {
  search: string;
  maxPrice: number; // 0 = no limit
  minDiscount: number;
  minMetacritic: number;
  minSteamRating: number;
  selectedGenre: string;
  minReleaseYear: number; // 0 = no filter, e.g. 2020 means released 2020 or newer
  coopOnly: boolean;
  allTimeLowOnly: boolean; // Only show games currently at their historical lowest price
}
