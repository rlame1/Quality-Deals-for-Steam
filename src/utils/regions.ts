import { RegionCode, RegionInfo } from '../types';

export const SUPPORTED_REGIONS: Record<RegionCode, RegionInfo> = {
  FI: {
    code: 'FI',
    nameEn: 'Finland / EU',
    nameFi: 'Suomi / Euroalue',
    currency: 'EUR',
    symbol: '€',
    symbolPosition: 'suffix',
    multiplier: 0.92, // Standard Steam USD to EUR ratio
    flag: '🇫🇮',
  },
  EU: {
    code: 'EU',
    nameEn: 'Eurozone (Western EU)',
    nameFi: 'Euroalue (Länsi-Eurooppa)',
    currency: 'EUR',
    symbol: '€',
    symbolPosition: 'suffix',
    multiplier: 0.92,
    flag: '🇪🇺',
  },
  US: {
    code: 'US',
    nameEn: 'United States',
    nameFi: 'Yhdysvallat',
    currency: 'USD',
    symbol: '$',
    symbolPosition: 'prefix',
    multiplier: 1.0,
    flag: '🇺🇸',
  },
  GB: {
    code: 'GB',
    nameEn: 'United Kingdom',
    nameFi: 'Iso-Britannia',
    currency: 'GBP',
    symbol: '£',
    symbolPosition: 'prefix',
    multiplier: 0.79,
    flag: '🇬🇧',
  },
  CA: {
    code: 'CA',
    nameEn: 'Canada',
    nameFi: 'Kanada',
    currency: 'CAD',
    symbol: 'C$',
    symbolPosition: 'prefix',
    multiplier: 1.36,
    flag: '🇨🇦',
  },
  AU: {
    code: 'AU',
    nameEn: 'Australia',
    nameFi: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    symbolPosition: 'prefix',
    multiplier: 1.52,
    flag: '🇦🇺',
  },
  SE: {
    code: 'SE',
    nameEn: 'Sweden',
    nameFi: 'Ruotsi',
    currency: 'SEK',
    symbol: 'kr',
    symbolPosition: 'suffix',
    multiplier: 10.5,
    flag: '🇸🇪',
  },
  NO: {
    code: 'NO',
    nameEn: 'Norway',
    nameFi: 'Norja',
    currency: 'NOK',
    symbol: 'kr',
    symbolPosition: 'suffix',
    multiplier: 10.7,
    flag: '🇳🇴',
  },
};

/**
 * Automatically detect user's region based on system timezone & locale.
 * Respects stored preference if user previously chose a region.
 */
export function detectUserRegion(): RegionInfo {
  // Check stored preference first
  try {
    const saved = localStorage.getItem('steamfinder_region') as RegionCode;
    if (saved && SUPPORTED_REGIONS[saved]) {
      return SUPPORTED_REGIONS[saved];
    }
  } catch {
    // Ignore localStorage errors
  }

  // Detect via Intl timezone
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Helsinki')) return SUPPORTED_REGIONS.FI;
    if (tz.includes('Stockholm')) return SUPPORTED_REGIONS.SE;
    if (tz.includes('Oslo')) return SUPPORTED_REGIONS.NO;
    if (tz.includes('London')) return SUPPORTED_REGIONS.GB;
    if (tz.includes('Toronto') || tz.includes('Vancouver') || tz.includes('Montreal')) return SUPPORTED_REGIONS.CA;
    if (tz.includes('Sydney') || tz.includes('Melbourne') || tz.includes('Perth') || tz.includes('Brisbane')) return SUPPORTED_REGIONS.AU;
    if (tz.startsWith('America/')) return SUPPORTED_REGIONS.US;
    if (tz.startsWith('Europe/')) return SUPPORTED_REGIONS.EU;
  } catch {
    // Continue to locale check
  }

  // Detect via browser languages
  try {
    const navLang = (navigator.language || '').toLowerCase();
    if (navLang.startsWith('fi')) return SUPPORTED_REGIONS.FI;
    if (navLang === 'en-gb') return SUPPORTED_REGIONS.GB;
    if (navLang === 'en-ca') return SUPPORTED_REGIONS.CA;
    if (navLang === 'en-au') return SUPPORTED_REGIONS.AU;
    if (navLang.startsWith('sv')) return SUPPORTED_REGIONS.SE;
    if (navLang.startsWith('no') || navLang.startsWith('nb') || navLang.startsWith('nn')) return SUPPORTED_REGIONS.NO;
  } catch {
    // Fallback
  }

  // Default to Finland / EU if user is Finnish/European, or US default
  return SUPPORTED_REGIONS.FI;
}

/**
 * Formats a numerical price into the user's localized regional currency format.
 */
export function formatRegionalPrice(price: number, region: RegionInfo): string {
  const adjusted = Number((price * region.multiplier).toFixed(2));
  if (region.symbolPosition === 'prefix') {
    return `${region.symbol}${adjusted.toFixed(2)}`;
  }
  return `${adjusted.toFixed(2)} ${region.symbol}`;
}

/**
 * Convert numerical value without formatting for calculations.
 */
export function getAdjustedPrice(price: number, region: RegionInfo): number {
  return Number((price * region.multiplier).toFixed(2));
}
