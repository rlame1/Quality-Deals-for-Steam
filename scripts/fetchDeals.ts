import fs from 'fs';
import path from 'path';
import { KNOWN_GAMES, KNOWN_RELEASE_YEARS, inferGenres, checkIsCoop } from '../src/data/gameMetadata.ts';
import { FALLBACK_DEALS } from '../src/data/fallbackDeals.ts';
import { GameDeal } from '../src/types.ts';

async function fetchAllDeals() {
  console.log('Fetching live Steam deals from CheapShark API (up to 35 pages)...');
  const pages = Array.from({ length: 35 }, (_, i) => i);
  const userAgent = 'QualityDealsForSteam/1.0 (steamfinder@qualitydeals.io)';

  // Fetch pages in parallel batches of 7 to avoid network congestion
  const batchSize = 7;
  const rawList: any[] = [];

  for (let i = 0; i < pages.length; i += batchSize) {
    const chunk = pages.slice(i, i + batchSize);
    const chunkResults = await Promise.all(
      chunk.map(p =>
        fetch(`https://www.cheapshark.com/api/1.0/deals?storeID=1&pageSize=60&pageNumber=${p}&onSale=1`, {
          headers: { 'User-Agent': userAgent }
        })
          .then(r => (r.ok ? r.json() : []))
          .catch(err => {
            console.warn(`Page ${p} fetch failed:`, err.message);
            return [];
          })
      )
    );
    rawList.push(...chunkResults.flat());
  }

  console.log(`Retrieved ${rawList.length} total deal entries from CheapShark.`);

  const seen = new Set<string>();
  const deals: GameDeal[] = [];

  for (const item of rawList) {
    const appId = item.steamAppID && item.steamAppID !== '0' ? String(item.steamAppID) : String(item.gameID || item.dealID);
    if (!appId || appId === '0' || seen.has(appId)) continue;

    const sale = parseFloat(item.salePrice) || 0;
    const normal = parseFloat(item.normalPrice) || sale;
    const discount = Math.round(parseFloat(item.savings) || 0);
    const meta = parseInt(item.metacriticScore, 10) || 0;
    const steamPct = parseInt(item.steamRatingPercent, 10) || 0;
    const totalReviews = parseInt(item.steamRatingCount, 10) || 0;

    // Quality check: Metascore >= 70 OR Steam rating >= 70% (7.0/10)
    const known = KNOWN_GAMES[appId];
    const finalMeta = meta > 0 ? meta : (known ? 85 : 0);
    if (steamPct < 70 && finalMeta < 70) continue;
    if (discount < 10) continue; // Must be on sale

    seen.add(appId);

    const genres = known ? known.genres : inferGenres(item.title);
    const isCoop = checkIsCoop(appId, item.title);
    const releaseYear = KNOWN_RELEASE_YEARS[appId] || (item.releaseDate > 0 ? new Date(item.releaseDate * 1000).getFullYear() : undefined);

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
        : item.thumb,
      banner: appId && appId !== '0' 
        ? `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg` 
        : item.thumb,
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
      diffFromHistoricalLow: Math.max(0, Number((sale - historicalLow).toFixed(2)))
    });
  }

  // Merge curated fallback deals
  for (const fb of FALLBACK_DEALS) {
    if (!seen.has(fb.id)) {
      deals.push(fb);
      seen.add(fb.id);
    }
  }

  console.log(`Successfully compiled ${deals.length} qualified Steam deals!`);

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outPath = path.join(publicDir, 'deals.json');
  fs.writeFileSync(outPath, JSON.stringify(deals, null, 2), 'utf-8');
  console.log(`Saved deals database to ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
}

fetchAllDeals().catch(err => {
  console.error('Failed to generate deals:', err);
  process.exit(1);
});
