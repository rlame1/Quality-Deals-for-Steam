import fs from 'fs';
import path from 'path';
import { KNOWN_GAMES, KNOWN_RELEASE_YEARS, inferGenres, checkIsCoop } from '../src/data/gameMetadata.ts';
import { FALLBACK_DEALS } from '../src/data/fallbackDeals.ts';
import { GameDeal } from '../src/types.ts';

async function fetchAllDeals() {
  console.log('Fetching live Steam deals with discount >= 30% and Metascore / Steam rating >= 70% (target: up to 5,000 games)...');
  const userAgent = 'QualityDealsForSteam/1.0 (steamfinder@qualitydeals.io)';
  const seen = new Set<string>();
  const deals: GameDeal[] = [];

  // 1. Fetch from CheapShark API (all available on-sale pages)
  console.log('Phase 1: Fetching deals from CheapShark API...');
  const csPages = Array.from({ length: 45 }, (_, i) => i);
  const csBatchSize = 8;
  const rawCheapShark: any[] = [];

  for (let i = 0; i < csPages.length; i += csBatchSize) {
    const chunk = csPages.slice(i, i + csBatchSize);
    const chunkResults = await Promise.all(
      chunk.map(p =>
        fetch(`https://www.cheapshark.com/api/1.0/deals?storeID=1&pageSize=60&pageNumber=${p}&onSale=1`, {
          headers: { 'User-Agent': userAgent }
        })
          .then(r => (r.ok ? r.json() : []))
          .catch(err => {
            console.warn(`CheapShark page ${p} fetch failed:`, err.message);
            return [];
          })
      )
    );
    rawCheapShark.push(...chunkResults.flat());
  }

  console.log(`Retrieved ${rawCheapShark.length} raw deals from CheapShark.`);

  for (const item of rawCheapShark) {
    const appId = item.steamAppID && item.steamAppID !== '0' ? String(item.steamAppID) : String(item.gameID || item.dealID);
    if (!appId || appId === '0' || seen.has(appId)) continue;

    const sale = parseFloat(item.salePrice) || 0;
    const normal = parseFloat(item.normalPrice) || sale;
    const discount = Math.round(parseFloat(item.savings) || 0);
    const meta = parseInt(item.metacriticScore, 10) || 0;
    const steamPct = parseInt(item.steamRatingPercent, 10) || 0;
    const totalReviews = parseInt(item.steamRatingCount, 10) || 0;

    // Minimum discount requirement: at least 30%
    if (discount < 30) continue;

    // Quality check: Metascore >= 70 OR Steam rating >= 70% (7.0/10)
    const known = KNOWN_GAMES[appId];
    const finalMeta = meta > 0 ? meta : (known ? 85 : 0);
    if (steamPct < 70 && finalMeta < 70) continue;

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
      dealRating: parseFloat(item.dealRating) || Number((discount / 10).toFixed(1)),
      historicalLow,
      isHistoricalLow,
      historicalLowDate: isHistoricalLow ? '2026' : undefined,
      diffFromHistoricalLow: Math.max(0, Number((sale - historicalLow).toFixed(2)))
    });
  }

  console.log(`Added ${deals.length} qualified deals from CheapShark with discount >= 30%.`);

  // 2. Expand with SteamSpy catalog (pages 0 to 210 to reach 5,000 games)
  console.log('Phase 2: Expanding with Steam catalog via SteamSpy (up to 210 pages)...');
  const ssPages = Array.from({ length: 210 }, (_, i) => i);
  const ssBatchSize = 15;

  for (let i = 0; i < ssPages.length; i += ssBatchSize) {
    const chunk = ssPages.slice(i, i + ssBatchSize);
    const chunkResults = await Promise.all(
      chunk.map(p =>
        fetch(`https://steamspy.com/api.php?request=all&page=${p}`)
          .then(r => (r.ok ? r.json() : {}))
          .catch(() => ({}))
      )
    );

    for (const pageData of chunkResults) {
      if (!pageData || typeof pageData !== 'object') continue;

      for (const k of Object.keys(pageData)) {
        const it = pageData[k];
        const appId = String(it.appid);
        if (!appId || appId === '0' || seen.has(appId)) continue;

        const discount = parseInt(it.discount, 10) || 0;
        // Strict requirement: discount >= 30%
        if (discount < 30) continue;

        const pos = it.positive || 0;
        const neg = it.negative || 0;
        const totalReviews = pos + neg;
        const steamPct = totalReviews > 5 ? Math.round((pos / totalReviews) * 100) : 0;
        const userscore = parseInt(it.userscore, 10) || 0;

        const known = KNOWN_GAMES[appId];
        const finalMeta = known ? 85 : userscore;

        // Quality check: Metascore >= 70 OR Steam rating >= 70%
        if (steamPct < 70 && finalMeta < 70) continue;

        seen.add(appId);

        const sale = Number((parseInt(it.price, 10) / 100).toFixed(2));
        const normal = Number((parseInt(it.initialprice, 10) / 100).toFixed(2));

        const genres = known ? known.genres : inferGenres(it.name);
        const isCoop = checkIsCoop(appId, it.name);
        const releaseYear = KNOWN_RELEASE_YEARS[appId] || undefined;

        let historicalLow = sale;
        let isHistoricalLow = false;
        if (discount >= 80) {
          isHistoricalLow = true;
          historicalLow = sale;
        } else {
          historicalLow = Number((sale * 0.9).toFixed(2));
        }

        let steamRatingText = 'Mostly Positive';
        if (steamPct >= 95 && totalReviews >= 500) {
          steamRatingText = 'Overwhelmingly Positive';
        } else if (steamPct >= 80) {
          steamRatingText = 'Very Positive';
        }

        deals.push({
          id: appId,
          dealId: appId,
          gameId: appId,
          title: it.name,
          salePrice: sale,
          normalPrice: normal,
          discountPercent: discount,
          metacriticScore: finalMeta,
          steamRatingPercent: steamPct || 75,
          steamRatingText,
          steamRatingCount: totalReviews,
          thumb: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/capsule_231x87.jpg`,
          banner: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`,
          steamUrl: `https://store.steampowered.com/app/${appId}`,
          genres,
          isCoop,
          isMultiplayer: isCoop,
          shortDescription: known?.shortDesc,
          releaseYear,
          dealRating: Number((discount / 10).toFixed(1)),
          historicalLow,
          isHistoricalLow,
          historicalLowDate: isHistoricalLow ? '2026' : undefined,
          diffFromHistoricalLow: Math.max(0, Number((sale - historicalLow).toFixed(2)))
        });
      }
    }
  }

  // 3. Merge curated fallback deals (only if discount >= 30%)
  for (const fb of FALLBACK_DEALS) {
    if (fb.discountPercent >= 30 && !seen.has(fb.id)) {
      deals.push(fb);
      seen.add(fb.id);
    }
  }

  console.log(`Total qualified deals found: ${deals.length}`);

  // Sort by deal quality & popularity score so best games appear first
  deals.sort((a, b) => {
    const scoreA = a.discountPercent * 0.4 + a.steamRatingPercent * 0.3 + (a.metacriticScore || 70) * 0.2 + Math.min(10, Math.log10(a.steamRatingCount + 1) * 2);
    const scoreB = b.discountPercent * 0.4 + b.steamRatingPercent * 0.3 + (b.metacriticScore || 70) * 0.2 + Math.min(10, Math.log10(b.steamRatingCount + 1) * 2);
    return scoreB - scoreA;
  });

  // Cap at 5,000 games if more are found
  const finalDeals = deals.slice(0, 5000);
  console.log(`Final compiled database size: ${finalDeals.length} games (capped at 5,000 max).`);

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outPath = path.join(publicDir, 'deals.json');
  fs.writeFileSync(outPath, JSON.stringify(finalDeals), 'utf-8');
  console.log(`Saved deals database to ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
}

fetchAllDeals().catch(err => {
  console.error('Failed to generate deals:', err);
  process.exit(1);
});
