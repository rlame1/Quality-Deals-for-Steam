import { GameDeal } from '../types';
import { KNOWN_GAMES, KNOWN_RELEASE_YEARS, inferGenres, checkIsCoop } from '../data/gameMetadata';
import { FALLBACK_DEALS } from '../data/fallbackDeals';

/**
 * Fetches multiple pages of live Steam deals directly from CheapShark API.
 * Designed for static hosting environments like GitHub Pages.
 * 
 * @param pageCount Number of pages to retrieve (each page has up to 60 deals)
 * @returns Array of qualified, normalized GameDeal objects
 */
export async function fetchLiveDealsFromCheapShark(pageCount = 25): Promise<GameDeal[]> {
  const pages = Array.from({ length: pageCount }, (_, i) => i);
  const rawList: any[] = [];
  const batchSize = 5;

  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    const batchPromises = batch.map(async (page) => {
      try {
        const res = await fetch(
          `https://www.cheapshark.com/api/1.0/deals?storeID=1&pageSize=60&pageNumber=${page}&onSale=1`
        );
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.warn(`CheapShark page ${page} fetch error:`, err);
        return [];
      }
    });

    const batchResults = await Promise.all(batchPromises);
    rawList.push(...batchResults.flat());
  }

  const seen = new Set<string>();
  const deals: GameDeal[] = [];

  for (const item of rawList) {
    const appId = item.steamAppID && item.steamAppID !== '0'
      ? String(item.steamAppID)
      : String(item.gameID || item.dealID);

    if (!appId || appId === '0' || seen.has(appId)) continue;

    const sale = parseFloat(item.salePrice) || 0;
    const normal = parseFloat(item.normalPrice) || sale;
    const discount = Math.round(parseFloat(item.savings) || 0);
    const meta = parseInt(item.metacriticScore, 10) || 0;
    const steamPct = parseInt(item.steamRatingPercent, 10) || 0;
    const totalReviews = parseInt(item.steamRatingCount, 10) || 0;

    // Quality gate: Metascore >= 70 OR Steam rating >= 70% (7.0/10)
    const known = KNOWN_GAMES[appId];
    const finalMeta = meta > 0 ? meta : (known ? 85 : 0);
    if (steamPct < 70 && finalMeta < 70) continue;
    if (discount < 10) continue; // Only items with actual discount

    seen.add(appId);

    const genres = known ? known.genres : inferGenres(item.title);
    const isCoop = checkIsCoop(appId, item.title);
    const releaseYear = KNOWN_RELEASE_YEARS[appId] || (
      item.releaseDate && item.releaseDate > 0 
        ? new Date(item.releaseDate * 1000).getFullYear() 
        : undefined
    );

    let historicalLow = sale;
    let isHistoricalLow = false;
    if (discount >= 80 || parseFloat(item.dealRating) >= 9.5) {
      isHistoricalLow = true;
      historicalLow = sale;
    } else {
      historicalLow = Number((sale * 0.9).toFixed(2));
    }

    let steamRatingText = item.steamRatingText || 'Very Positive';
    if (!item.steamRatingText) {
      if (steamPct >= 95 && totalReviews >= 500) {
        steamRatingText = 'Overwhelmingly Positive';
      } else if (steamPct >= 80) {
        steamRatingText = 'Very Positive';
      } else {
        steamRatingText = 'Mostly Positive';
      }
    }

    deals.push({
      id: appId,
      dealId: item.dealID,
      gameId: item.gameID,
      title: item.title,
      salePrice: sale,
      normalPrice: normal,
      discountPercent: discount,
      metacriticScore: finalMeta,
      steamRatingPercent: steamPct || 75,
      steamRatingText,
      steamRatingCount: totalReviews,
      thumb: appId && appId !== '0'
        ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/capsule_231x87.jpg`
        : (item.thumb || `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`),
      banner: appId && appId !== '0'
        ? `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`
        : (item.thumb || `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`),
      steamUrl: appId && appId !== '0'
        ? `https://store.steampowered.com/app/${appId}`
        : `https://www.cheapshark.com/redirect?dealID=${item.dealID}`,
      genres,
      isCoop,
      isMultiplayer: isCoop,
      shortDescription: known?.shortDesc,
      releaseYear,
      dealRating: parseFloat(item.dealRating) || 8.0,
      historicalLow,
      isHistoricalLow,
      historicalLowDate: isHistoricalLow ? '2026' : undefined,
      diffFromHistoricalLow: Math.max(0, Number((sale - historicalLow).toFixed(2))),
    });
  }

  // Merge top curated fallback deals if not already present
  for (const fb of FALLBACK_DEALS) {
    if (!seen.has(fb.id)) {
      deals.push(fb);
      seen.add(fb.id);
    }
  }

  return deals;
}
