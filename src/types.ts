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
